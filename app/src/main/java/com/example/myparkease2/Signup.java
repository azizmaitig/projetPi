package com.example.myparkease2;

import android.app.DownloadManager;
import android.app.VoiceInteractor;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.vishnusivadas.advanced_httpurlconnection.PutData;

import java.util.HashMap;
import okhttp3.*;


public class Signup extends AppCompatActivity {

    private EditText etName, email, phone, password, Cpass;
    private ImageView imageView, imageView2;
    private Button signupButt;
    private boolean isPasswordVisible = false;
    private boolean isCpassVisible = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        // Liaison avec les composants XML
        etName = findViewById(R.id.et_name);
        email = findViewById(R.id.email);
        phone = findViewById(R.id.phone);
        password = findViewById(R.id.password);
        Cpass = findViewById(R.id.Cpass);
        imageView = findViewById(R.id.imageView);
        imageView2 = findViewById(R.id.imageView2);
        signupButt = findViewById(R.id.signupButt);

        // Gestion de l'affichage du mot de passe
        imageView.setOnClickListener(view -> {
            isPasswordVisible = !isPasswordVisible;
            if (isPasswordVisible) {
                password.setInputType(InputType.TYPE_CLASS_TEXT);
            } else {
                password.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
            password.setSelection(password.getText().length());
        });

        // Gestion de l'affichage de la confirmation du mot de passe
        imageView2.setOnClickListener(view -> {
            isCpassVisible = !isCpassVisible;
            if (isCpassVisible) {
                Cpass.setInputType(InputType.TYPE_CLASS_TEXT);
            } else {
                Cpass.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
            Cpass.setSelection(Cpass.getText().length());
        });

        // Redirection vers l'interface Signin lors du clic sur Sign Up
        signupButt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String Nom, Email, Phone, passwordtxt, cpasswordt;
                Nom = String.valueOf(etName.getText());
                Email = String.valueOf(email.getText());
                Phone = String.valueOf(phone.getText());
                passwordtxt = String.valueOf(password.getText());
                cpasswordt = String.valueOf(Cpass.getText());

                if (!Nom.equals("") && !Phone.equals("") && !passwordtxt.equals("") && !Email.equals("")) {


                    //Start ProgressBar first (Set visibility VISIBLE)
                    Handler handler = new Handler(Looper.getMainLooper());
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
                            //Starting Write and Read data with URL
                            //Creating array for parameters
                            String[] field = new String[5];
                            field[0] = "Nom";
                            field[1] = "Email";
                            field[2] = "Phone";
                            field[3] = "password";
                            field[4] = "cpassword";
                            //Creating array for data
                            String[] data = new String[5];
                            data[0] = Nom;
                            data[1] = Email;
                            data[2] = Phone;
                            data[3] = passwordtxt;
                            data[4] = cpasswordt;


                            PutData putData = new PutData("http://192.168.100.145/LoginRegister/signup.php", "POST", field, data);
                            if (putData.startPut()) {
                                if (putData.onComplete()) {
                                    String result = putData.getResult();
                                    if (result.equals("Sign Up Success")){
                                        Toast.makeText(getApplicationContext(),result,Toast.LENGTH_SHORT).show();
                                        Intent intent = new Intent(getApplicationContext(), Signin.class);
                                        startActivity(intent);
                                        finish();



                                    }
                                    else {
                                        Toast.makeText(getApplicationContext(),result,Toast.LENGTH_SHORT).show();
                                    }

                                }
                            }
                            //End Write and Read data with URL
                        }
                    });
                } else {
                    Toast.makeText(getApplicationContext(), "All fields required", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }






};