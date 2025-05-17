package com.example.myparkease2.model;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.ColumnInfo;

@Entity(tableName = "parking_spots")
public class ParkingSpot {

    @PrimaryKey
    @NonNull
    @ColumnInfo(name = "spot_id")
    private String spotId; // Unique identifier (e.g., "A1_Ground", "B6_Floor1")

    @ColumnInfo(name = "spot_number")
    private String spotNumber; // A1, A2, ..., B6

    @ColumnInfo(name = "floor")
    private String floor; // "Ground" or "Floor1"

    @ColumnInfo(name = "is_reserved")
    private boolean isReserved;

    @ColumnInfo(name = "date")
    private String date; // Reservation date (YYYY-MM-DD) or null

    @ColumnInfo(name = "start_time")
    private String startTime; // Reservation start time (HH:mm) or null

    @ColumnInfo(name = "end_time")
    private String endTime; // Reservation end time (HH:mm) or null

    public ParkingSpot(@NonNull String spotId, String spotNumber, String floor) {
        this.spotId = spotId;
        this.spotNumber = spotNumber;
        this.floor = floor;
        this.isReserved = false; // Initially, all spots are unreserved
        this.date = null;
        this.startTime = null;
        this.endTime = null;
    }

    public String getSpotId() {
        return spotId;
    }

    public String getSpotNumber() {
        return spotNumber;
    }

    public String getFloor() {
        return floor;
    }

    public boolean isReserved() {
        return isReserved;
    }

    public void setReserved(boolean reserved) {
        isReserved = reserved;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
