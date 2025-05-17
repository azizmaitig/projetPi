package com.example.myparkease2;

import android.annotation.SuppressLint;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;


public class places_park extends AppCompatActivity {

    private Button buttonUpdate;
    private TextView textStatus;
    private String esp32Url = "http://192.168.1.45";  // IP de l'ESP32

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        buttonUpdate = findViewById(R.id.buttonUpdate);
        textStatus = findViewById(R.id.textStatus);

        buttonUpdate.setOnClickListener(v -> new GetParkingStatus().execute());
    }

    // AsyncTask pour envoyer la requête HTTP et récupérer la réponse
    private class GetParkingStatus extends AsyncTask<Void, Void, String> {

        @Override
        protected String doInBackground(Void... voids) {
            String result = "";
            try {
                // Créer la connexion HTTP
                URL url = new URL(esp32Url);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestMethod("GET");
                urlConnection.setConnectTimeout(5000);  // 5 secondes de timeout
                urlConnection.setReadTimeout(5000);     // 5 secondes de timeout

                // Lire la réponse
                InputStreamReader inputStreamReader = new InputStreamReader(urlConnection.getInputStream());
                int data = inputStreamReader.read();
                while (data != -1) {
                    result += (char) data;
                    data = inputStreamReader.read();
                }
                inputStreamReader.close();
            } catch (Exception e) {
                result = "Erreur : " + e.getMessage();
            }
            return result;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            // Mettre à jour l'UI avec la réponse
            textStatus.setText(result);
        }
    }
}