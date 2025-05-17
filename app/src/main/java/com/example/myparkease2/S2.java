package com.example.myparkease2;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class S2 extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_s2);
        // Bouton Search pour aller à Search.class
        Button searchButton = findViewById(R.id.searchButton);
        searchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(S2.this, Search.class);
                startActivity(intent);
            }
        });

        // Bouton Go pour aller à ParkingLayoutActivity.class
        Button goButtonStandard = findViewById(R.id.btn_standard);


        View.OnClickListener goClickListener = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(S2.this, ParkingLayoutActivity.class);
                startActivity(intent);
            }
        };

        goButtonStandard.setOnClickListener(goClickListener);

    }
}