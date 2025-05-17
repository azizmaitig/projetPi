package com.example.myparkease2;

import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import android.os.AsyncTask;
import android.widget.Toast;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

import com.vishnusivadas.advanced_httpurlconnection.PutData;

public class Signin extends AppCompatActivity {
    private EditText passwordField;
    private ImageView togglePassword;
    private boolean isPasswordVisible = false;
    private  EditText email ;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signin);

        ImageView backArrow = findViewById(R.id.imageView9);
        TextView createAccount = findViewById(R.id.createAccount);
        Button signInButton = findViewById(R.id.signInButton);
        ImageView fbIcon = findViewById(R.id.facebookIcon);
        ImageView googleIcon = findViewById(R.id.googleIcon);
        passwordField = findViewById(R.id.editTextTextPassword);
        togglePassword = findViewById(R.id.imageView9);
        TextView forgotPassword = findViewById(R.id.forgotPassword);
        email =findViewById(R.id.editTextTextEmailAddress);

        // Retour à l'activité GStarted
        backArrow.setOnClickListener(v -> {
            Intent intent = new Intent(Signin.this, GStarted.class);
            startActivity(intent);
            finish();
        });

        // Aller à l'activité Signup
        createAccount.setOnClickListener(v -> {
            Intent intent = new Intent(Signin.this, Signup.class);
            startActivity(intent);
        });


        // Ouvrir Facebook
        fbIcon.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.facebook.com"));
            startActivity(intent);
        });

        // Ouvrir Google
        googleIcon.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com"));
            startActivity(intent);
        });

        // Afficher/Masquer le mot de passe
        togglePassword.setOnClickListener(v -> {
            if (isPasswordVisible) {
                passwordField.setTransformationMethod(PasswordTransformationMethod.getInstance());
                togglePassword.setImageResource(android.R.drawable.ic_menu_view);
                isPasswordVisible = false;
            } else {
                passwordField.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                togglePassword.setImageResource(android.R.drawable.ic_lock_idle_lock);
                isPasswordVisible = true;
            }
        });
        // Clic sur "Forgot Password" -> Aller à l'activité resetpass
        forgotPassword.setOnClickListener(v -> {
            Intent intent = new Intent(Signin.this, Resetpass.class); // Assurez-vous que l'activité ResetPass existe
            startActivity(intent);
        });
        // Bouton Sign In -> Aller à l'activité Search
        signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String Email, passl;
                Email = String.valueOf(email.getText());
                passl = String.valueOf(passwordField.getText());

                // Skip the database check and move directly to S2
                if (!passl.equals("") && !Email.equals("")) {
                    Toast.makeText(getApplicationContext(), "Login Bypassed - Moving to Next Page", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(getApplicationContext(), Search.class);
                    startActivity(intent);
                    finish(); // Close current activity
                } else {
                    Toast.makeText(getApplicationContext(), "All fields required", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}