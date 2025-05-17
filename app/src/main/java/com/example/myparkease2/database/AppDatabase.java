package com.example.myparkease2.database;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.example.myparkease2.model.ParkingSpot;

import java.util.concurrent.Executors;

@Database(entities = {ParkingSpot.class}, version = 1, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {

    private static volatile AppDatabase INSTANCE;

    public abstract ParkingSpotDao parkingSpotDao();

    public static AppDatabase getInstance(final Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                                    context.getApplicationContext(),
                                    AppDatabase.class, "parking_database"
                            ).allowMainThreadQueries()
                            .build();

                    // Initialize database with 24 spots on first launch
                    Executors.newSingleThreadExecutor().execute(() -> INSTANCE.populateDatabase());
                }
            }
        }
        return INSTANCE;
    }

    private void populateDatabase() {
        ParkingSpotDao dao = INSTANCE.parkingSpotDao();
        dao.clearAllSpots(); // Remove existing spots

        String[] floors = {"Ground", "Floor1"};
        for (String floor : floors) {
            for (int i = 1; i <= 6; i++) {
                String spotA = "A" + i;
                String spotB = "B" + i;
                dao.insert(new ParkingSpot(spotA + "_" + floor, spotA, floor));
                dao.insert(new ParkingSpot(spotB + "_" + floor, spotB, floor));
            }
        }
    }
}
