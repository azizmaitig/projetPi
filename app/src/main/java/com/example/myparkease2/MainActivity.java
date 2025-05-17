package com.example.myparkease2;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private Button buttonFeedback;

    private Button btnRating ;
    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);  // Assurez-vous que l'ID XML correspond

        // Trouver le bouton "GO"
        buttonFeedback = findViewById(R.id.btn_feedback);
        Button goButton = findViewById(R.id.goButton);

        btnRating = findViewById(R.id.btn_rating);





        // Définir l'action lorsque le bouton est cliqué
        goButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Créer un Intent pour démarrer GStartedActivity
                Intent intent = new Intent(MainActivity.this, GStarted.class);
                startActivity(intent);  // Démarrer l'activité GStartedActivity
            }
        });




        buttonFeedback.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Ouvrir la classe FeedbackActivity
                Intent intent = new Intent(MainActivity.this, feedback.class);
                startActivity(intent);
            }
        });



        btnRating.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =new Intent(MainActivity.this , raiting_sys.class);
                startActivity(intent);
            }
        });
    }
}
