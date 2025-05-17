package com.example.myparkease2;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.HashMap;
import java.util.Map;

public class codepass extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_codepass);
        String Email = getIntent().getExtras().getString("Email");
        EditText editTextNewPassword = findViewById(R.id.code2);
        EditText editTextOTP = findViewById(R.id.emailEditText2);
        Button button = findViewById(R.id.submitButton2);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RequestQueue queue = Volley.newRequestQueue(codepass.this);
                String url = "http://192.168.100.145/loginregister/new-password.php";

                StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                if (response.equals("success")){
                                    Toast.makeText(getApplicationContext(),"New password Set " , Toast.LENGTH_SHORT).show();
                                    Intent intent = new Intent(getApplicationContext(), Signin.class);

                                    startActivity(intent);
                                    finish();

                                }
                                else {
                                }         Toast.makeText(getApplicationContext(),response , Toast.LENGTH_SHORT).show();}


                        },
                        new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                error.printStackTrace();
                            }
                        }) {
                    @Override
                    protected Map<String, String> getParams() {
                        Map<String, String> params = new HashMap<>();
                        params.put("Email", Email);
                        params.put("otp", editTextOTP.getText().toString());
                        params.put("new-password", editTextNewPassword.getText().toString());// Assuming you're sending the email entered
                        return params;
                    }
                };

                queue.add(stringRequest); // Correct way to add the request to the queue
            }
        });


    }
}