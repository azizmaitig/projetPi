package com.example.myparkease2;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;


import com.example.myparkease2.database.AppDatabase;
import com.example.myparkease2.database.ParkingSpotDao;
import com.example.myparkease2.model.ParkingSpot;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.regex.Pattern;

public class BookingActivity extends AppCompatActivity {

    // UI Elements
    private ImageView backButton;
    private EditText nameEditText, licensePlateEditText, startTimeEditText, endTimeEditText, dateEditText;
    private Button bookButton;
    private TextView spotIdTextView;

    // Date and Time Formatters
    private SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm", Locale.getDefault());
    private SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());

    // License Plate Pattern (Uses "Tunis" instead of Arabic)
    private final Pattern LICENSE_PLATE_PATTERN = Pattern.compile("^[0-9]{3} Tunis [0-9]{4}$");

    private ParkingSpotDao spotDao;
    private String selectedSpotId; // Store cleaned spot ID

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.booking_form_layout);

        // Initialize database
        AppDatabase database = AppDatabase.getInstance(this);
        spotDao = database.parkingSpotDao();

        // Initialize UI elements
        initializeViews();
        setupListeners();

        // Get and clean the spot ID from intent
        String fullSpotName = getIntent().getStringExtra("SPOT_ID");
        if (fullSpotName != null && !fullSpotName.isEmpty()) {
            selectedSpotId = fullSpotName.replace("Spot ", "").trim(); // Remove "Spot " prefix
            spotIdTextView.setText(fullSpotName); // Display "Spot A1" on UI
        }
    }

    private void initializeViews() {
        backButton = findViewById(R.id.back_button);
        nameEditText = findViewById(R.id.name_edit_text);
        licensePlateEditText = findViewById(R.id.license_plate_edit_text);
        startTimeEditText = findViewById(R.id.start_time_edit_text);
        endTimeEditText = findViewById(R.id.end_time_edit_text);
        dateEditText = findViewById(R.id.date_edit_text);
        bookButton = findViewById(R.id.book_button);
        spotIdTextView = findViewById(R.id.spot_id);
    }

    private void setupListeners() {
        backButton.setOnClickListener(v -> onBackPressed());

        // Time Picker for Start Time
        startTimeEditText.setOnClickListener(v -> showTimePickerDialog(startTimeEditText));

        // Time Picker for End Time
        endTimeEditText.setOnClickListener(v -> showTimePickerDialog(endTimeEditText));

        // Date Picker
        dateEditText.setOnClickListener(v -> showDatePickerDialog());

        bookButton.setOnClickListener(v -> validateAndBook());
    }

    private void showTimePickerDialog(final EditText timeField) {
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);

        TimePickerDialog timePickerDialog = new TimePickerDialog(
                this,
                (view, hourOfDay, minute1) -> {
                    Calendar selectedTime = Calendar.getInstance();
                    selectedTime.set(Calendar.HOUR_OF_DAY, hourOfDay);
                    selectedTime.set(Calendar.MINUTE, minute1);
                    timeField.setText(timeFormat.format(selectedTime.getTime()));

                    if (!startTimeEditText.getText().toString().isEmpty() &&
                            !endTimeEditText.getText().toString().isEmpty()) {
                        validateTimeRange();
                    }
                },
                hour,
                minute,
                true
        );
        timePickerDialog.show();
    }

    private void showDatePickerDialog() {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog datePickerDialog = new DatePickerDialog(
                this,
                (view, year1, month1, dayOfMonth) -> {
                    Calendar selectedDate = Calendar.getInstance();
                    selectedDate.set(year1, month1, dayOfMonth);
                    dateEditText.setText(dateFormat.format(selectedDate.getTime()));
                },
                year,
                month,
                day
        );

        datePickerDialog.getDatePicker().setMinDate(System.currentTimeMillis() - 1000);
        datePickerDialog.show();
    }

    private boolean validateFields() {
        return validateName() && validateLicensePlate() && validateTimeRange() && validateDate();
    }

    private boolean validateName() {
        String name = nameEditText.getText().toString().trim();
        if (name.isEmpty()) {
            nameEditText.setError("Name cannot be empty");
            return false;
        }
        nameEditText.setError(null);
        return true;
    }

    private boolean validateLicensePlate() {
        String licensePlate = licensePlateEditText.getText().toString().trim();
        if (licensePlate.isEmpty()) {
            licensePlateEditText.setError("License plate cannot be empty");
            return false;
        }
        if (!LICENSE_PLATE_PATTERN.matcher(licensePlate).matches()) {
            licensePlateEditText.setError("Format should be '123 Tunis 4567'");
            return false;
        }
        licensePlateEditText.setError(null);
        return true;
    }

    private boolean validateTimeRange() {
        try {
            String startTimeStr = startTimeEditText.getText().toString();
            String endTimeStr = endTimeEditText.getText().toString();

            if (startTimeStr.isEmpty() || endTimeStr.isEmpty()) {
                return false;
            }

            if (timeFormat.parse(startTimeStr).after(timeFormat.parse(endTimeStr))) {
                endTimeEditText.setError("End time must be after start time");
                return false;
            }
            startTimeEditText.setError(null);
            endTimeEditText.setError(null);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }

    private boolean validateDate() {
        String dateStr = dateEditText.getText().toString();
        if (dateStr.isEmpty()) {
            dateEditText.setError("Date cannot be empty");
            return false;
        }
        dateEditText.setError(null);
        return true;
    }

    private void validateAndBook() {
        if (!validateFields()) {
            Toast.makeText(this, "Please fix the errors before booking", Toast.LENGTH_SHORT).show();
            return;
        }

        new Thread(() -> {
            String floor = getIntent().getStringExtra("FLOOR");
            String formattedFloor = floor.equals("Ground Floor") ? "Ground" : "Floor1";

            String cleanedSpotId = selectedSpotId.replace("Spot ", "").trim();
            String formattedSpotId = cleanedSpotId + "_" + formattedFloor;

            // 🔥 Check if spot is already reserved before booking
            ParkingSpot spot = spotDao.getSpotById(formattedSpotId);
            if (spot != null && spot.isReserved()) {
                runOnUiThread(() ->
                        Toast.makeText(this, "This spot is already reserved!", Toast.LENGTH_SHORT).show()
                );
                return;
            }

            // ✅ Mark spot as reserved
            spotDao.updateReservationStatus(formattedSpotId, true);

            runOnUiThread(() -> {
                Toast.makeText(this, "Booking successful for " + cleanedSpotId, Toast.LENGTH_LONG).show();

                // Return to ParkingSelectionActivity
                Intent intent = new Intent(this, QrCode.class);
                intent.putExtra("FLOOR", floor);
                startActivity(intent);
                finish();
            });
        }).start();
    }

}
