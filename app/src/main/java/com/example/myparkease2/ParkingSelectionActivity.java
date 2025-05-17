package com.example.myparkease2;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myparkease2.database.AppDatabase;
import com.example.myparkease2.database.ParkingSpotDao;
import com.example.myparkease2.model.ParkingSpot;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ParkingSelectionActivity extends AppCompatActivity {

    private Map<String, View> spotViews = new HashMap<>();
    private Map<String, ImageView> lockImageViews = new HashMap<>();
    private Map<String, TextView> spotNameViews = new HashMap<>();
    private Map<String, Boolean> spotBookingStatus = new HashMap<>();

    private ParkingSpotDao spotDao;
    private String selectedFloor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.choose_your_spot);

        selectedFloor = getIntent().getStringExtra("FLOOR");
        if (selectedFloor == null) {
            selectedFloor = "Ground Floor";
        }

        Log.d("DEBUG", "Selected Floor: " + selectedFloor);

        AppDatabase database = AppDatabase.getInstance(this);
        spotDao = database.parkingSpotDao();

        findViewById(R.id.back_button).setOnClickListener(v -> onBackPressed());

        initializeParkingSpots();
        loadBookingStatusFromDatabase();
    }

    private void initializeParkingSpots() {
        for (int i = 1; i <= 6; i++) {
            String spotA = "A" + i;
            String spotB = "B" + i;

            int spotAViewId = getResources().getIdentifier("spot_" + spotA.toLowerCase(), "id", getPackageName());
            int spotBViewId = getResources().getIdentifier("spot_" + spotB.toLowerCase(), "id", getPackageName());

            if (spotAViewId != 0) {
                View spotCardA = findViewById(spotAViewId);
                TextView nameAView = spotCardA.findViewById(R.id.spot_name);
                ImageView lockAView = spotCardA.findViewById(R.id.lock_icon); // ✅ Get lock icon

                nameAView.setText("Spot " + spotA);
                spotViews.put(spotA, spotCardA);
                lockImageViews.put(spotA, lockAView); // ✅ Store in map

                spotCardA.setOnClickListener(v -> handleSpotClick(spotA));
            }

            if (spotBViewId != 0) {
                View spotCardB = findViewById(spotBViewId);
                TextView nameBView = spotCardB.findViewById(R.id.spot_name);
                ImageView lockBView = spotCardB.findViewById(R.id.lock_icon); // ✅ Get lock icon

                nameBView.setText("Spot " + spotB);
                spotViews.put(spotB, spotCardB);
                lockImageViews.put(spotB, lockBView); // ✅ Store in map

                spotCardB.setOnClickListener(v -> handleSpotClick(spotB));
            }
        }
    }




    private void loadBookingStatusFromDatabase() {
        new Thread(() -> {
            List<ParkingSpot> spots = spotDao.getAllSpots();
            spotBookingStatus.clear();

            // ✅ Format selected floor properly
            String formattedFloor = selectedFloor.equals("Ground Floor") ? "Ground" : "Floor1";

            for (ParkingSpot spot : spots) {
                String formattedSpotId = spot.getSpotNumber() + "_" + formattedFloor; // e.g., "A1_Ground"

                if (spot.getFloor().equals(formattedFloor)) {
                    spotBookingStatus.put(formattedSpotId, spot.isReserved());
                }
            }

            runOnUiThread(this::updateAllSpotsUI);
        }).start();
    }


    private void updateAllSpotsUI() {
        for (Map.Entry<String, View> entry : spotViews.entrySet()) {
            String spotId = entry.getKey();
            String formattedSpotId = spotId + "_" + (selectedFloor.equals("Ground Floor") ? "Ground" : "Floor1");

            boolean isBooked = spotBookingStatus.getOrDefault(formattedSpotId, false);
            View spotCard = spotViews.get(spotId);
            ImageView lockImageView = lockImageViews.get(spotId); // ✅ Get the lock icon

            if (spotCard != null) {
                spotCard.setClickable(!isBooked);
                spotCard.setAlpha(isBooked ? 0.5f : 1.0f); // 🔒 Dim if booked
            }

            if (lockImageView != null) {
                lockImageView.setImageResource(isBooked ? R.drawable.locked : R.drawable.unlocked); // ✅ Fix: Update lock icon
            }

            Log.d("DEBUG", "Spot " + formattedSpotId + " is " + (isBooked ? "Booked" : "Available"));
        }
    }




    private void handleSpotClick(String spotId) {
        // ✅ Convert spotId to match database format
        String formattedSpotId = spotId + "_" + (selectedFloor.equals("Ground Floor") ? "Ground" : "Floor1");

        boolean isBooked = spotBookingStatus.getOrDefault(formattedSpotId, false);

        if (isBooked) {
            Toast.makeText(this, "This spot is already booked. Please select another one.", Toast.LENGTH_SHORT).show();
        } else {
            Intent intent = new Intent(this, BookingActivity.class);
            intent.putExtra("SPOT_ID", "Spot " + spotId);
            intent.putExtra("FLOOR", selectedFloor);
            startActivity(intent);
        }
    }



    @Override
    protected void onResume() {
        super.onResume();
        loadBookingStatusFromDatabase();
    }
}