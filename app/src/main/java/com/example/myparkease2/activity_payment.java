package com.example.myparkease2;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class activity_payment extends AppCompatActivity {

    private EditText cardHolderName, cardNumber, expiryDate;
    private Button submitButton , feedbackButton;
    private Button btnRating ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment);

        // Initialiser les vues
        cardHolderName = findViewById(R.id.cardHolderName);
        cardNumber = findViewById(R.id.cardNumber);
        expiryDate = findViewById(R.id.expiryDate);
        submitButton = findViewById(R.id.submitButton);
        feedbackButton = findViewById(R.id.feedbackButton);
        btnRating = findViewById(R.id.ratingButton);
        // Gérer le clic sur le bouton
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                envoyerPaiement();
            }
        });

        // Gérer le clic sur le bouton Feedback
        feedbackButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(activity_payment.this, feedback.class);
                startActivity(intent);
            }
        });

        btnRating.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent =new Intent(activity_payment.this , raiting_sys.class);
                startActivity(intent);
            }
        });

    }

    private void envoyerPaiement() {
        // Récupérer les valeurs des champs
        String holderName = cardHolderName.getText().toString().trim();
        String cardNum = cardNumber.getText().toString().trim();
        String expDate = expiryDate.getText().toString().trim();

        // Vérification des champs
        if (holderName.isEmpty() || cardNum.isEmpty() || expDate.isEmpty()) {
            Toast.makeText(activity_payment.this, "Veuillez remplir tous les champs", Toast.LENGTH_SHORT).show();
            return;
        }

        // Simuler un ID utilisateur (remplacez avec une valeur réelle si nécessaire)
        int userId = 1;

        // Initialiser Retrofit
        Retrofit retrofit = RetrofitClient.getClient();
        PaymentApi api = retrofit.create(PaymentApi.class);

        // Envoyer la requête
        Call<ApiResponse> call = api.addPayment(userId, cardNum, expDate, holderName);
        call.enqueue(new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    if (response.body().isSuccess()) {
                        Toast.makeText(activity_payment.this, "Paiement ajouté avec succès", Toast.LENGTH_SHORT).show();
                        // Nettoyer le formulaire
                        cardHolderName.setText("");
                        cardNumber.setText("");
                        expiryDate.setText("");
                    } else {
                        Toast.makeText(activity_payment.this, response.body().getMessage(), Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(activity_payment.this, "Erreur du serveur", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                Toast.makeText(activity_payment.this, "Échec de connexion: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("PaymentAPI", "Erreur: ", t);
            }
        });
    }
}
