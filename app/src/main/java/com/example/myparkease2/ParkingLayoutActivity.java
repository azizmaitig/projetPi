package com.example.myparkease2;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import com.example.myparkease2.database.AppDatabase;
import com.example.myparkease2.database.ParkingSpotDao;
import com.example.myparkease2.model.ParkingSpot;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ParkingLayoutActivity extends AppCompatActivity {

    private CardView floorSelector;
    private TextView floorText;
    private Button confirmButton;

    private Map<String, TextView> spotViews = new HashMap<>();
    private Map<String, ImageView> carViews = new HashMap<>();

    private final String[] floors = {"Ground Floor", "First Floor"};
    private int currentFloorIndex = 0;

    private ParkingSpotDao spotDao;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.parking_selection_layout);

        AppDatabase database = AppDatabase.getInstance(this);
        spotDao = database.parkingSpotDao();

        initializeViews();

        floorText.setText(floors[currentFloorIndex]);

        setupFloorSelector();
        initializeParkingSpots();
        loadOccupiedSpotsFromDatabase();
        setupConfirmButton();

        findViewById(R.id.back_button).setOnClickListener(v -> onBackPressed());
    }

    private void initializeViews() {
        floorSelector = findViewById(R.id.floor_selector);
        floorText = findViewById(R.id.floor_text);
        confirmButton = findViewById(R.id.confirm_button);
    }

    private void setupFloorSelector() {
        floorSelector.setOnClickListener(v -> showFloorPicker());
    }

    private void showFloorPicker() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select Floor");

        builder.setSingleChoiceItems(floors, currentFloorIndex, (dialog, which) -> {
            currentFloorIndex = which;
            floorText.setText(floors[currentFloorIndex]);
            loadOccupiedSpotsFromDatabase();
            dialog.dismiss();
        });

        builder.show();
    }

    private void initializeParkingSpots() {
        for (int i = 1; i <= 6; i++) {
            String spotA = "A" + i;
            String spotB = "B" + i;

            int textViewAId = getResources().getIdentifier("spot_" + spotA.toLowerCase(), "id", getPackageName());
            int textViewBId = getResources().getIdentifier("spot_" + spotB.toLowerCase(), "id", getPackageName());

            int carAId = getResources().getIdentifier("car_" + spotA.toLowerCase(), "id", getPackageName());
            int carBId = getResources().getIdentifier("car_" + spotB.toLowerCase(), "id", getPackageName());

            if (textViewAId != 0) {
                spotViews.put(spotA, findViewById(textViewAId));
                carViews.put(spotA, findViewById(carAId));
            }

            if (textViewBId != 0) {
                spotViews.put(spotB, findViewById(textViewBId));
                carViews.put(spotB, findViewById(carBId));
            }
        }
    }

    private void loadOccupiedSpotsFromDatabase() {
        new Thread(() -> {
            String currentFloor = floors[currentFloorIndex].equals("Ground Floor") ? "Ground" : "Floor1";

            List<ParkingSpot> occupiedSpots = spotDao.getAllSpots();

            runOnUiThread(() -> {
                // Hide all car icons initially
                for (ImageView carView : carViews.values()) {
                    carView.setVisibility(View.GONE);
                }
            });

            for (ParkingSpot spot : occupiedSpots) {
                String formattedSpotId = spot.getSpotNumber() + "_" + spot.getFloor(); // Example: "A1_Ground"

                if (spot.isReserved() && spot.getFloor().equals(currentFloor)) {
                    runOnUiThread(() -> {
                        ImageView carView = carViews.get(spot.getSpotNumber()); // Retrieve correct ImageView
                        if (carView != null) {
                            carView.setVisibility(View.VISIBLE); // Show car in booked spot
                        } else {
                            Log.e("ERROR", "Car image not found for: " + formattedSpotId);
                        }
                    });
                }
            }
        }).start();
    }


    private void setupConfirmButton() {
        confirmButton.setOnClickListener(v -> {
            if (currentFloorIndex < 0 || currentFloorIndex >= floors.length) {
                Toast.makeText(this, "Error selecting floor. Please try again.", Toast.LENGTH_SHORT).show();
                return;
            }

            Intent intent = new Intent(this, ParkingSelectionActivity.class);
            intent.putExtra("FLOOR", floors[currentFloorIndex]);
            startActivity(intent);
        });
    }
}