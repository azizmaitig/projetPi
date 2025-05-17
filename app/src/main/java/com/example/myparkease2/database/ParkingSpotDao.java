package com.example.myparkease2.database;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.example.myparkease2.model.ParkingSpot;

import java.util.List;

@Dao
public interface ParkingSpotDao {

    @Insert
    void insert(ParkingSpot parkingSpot);

    @Update
    void update(ParkingSpot parkingSpot);

    @Query("SELECT * FROM parking_spots WHERE spot_id = :spotId")
    ParkingSpot getSpotById(String spotId);

    @Query("SELECT * FROM parking_spots WHERE is_reserved = 0")
    List<ParkingSpot> getAvailableSpots();

    @Query("SELECT * FROM parking_spots")
    List<ParkingSpot> getAllSpots();

    // ✅ New method to update reservation status
    @Query("UPDATE parking_spots SET is_reserved = :isReserved WHERE spot_id = :spotId")
    void updateReservationStatus(String spotId, boolean isReserved);

    @Query("UPDATE parking_spots SET is_reserved = 0 WHERE end_time < time('now')")
    void releaseExpiredReservations();

    @Query("DELETE FROM parking_spots")
    void clearAllSpots();
}
