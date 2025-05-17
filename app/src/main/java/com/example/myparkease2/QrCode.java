package com.example.myparkease2;






import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.myparkease2.databinding.ActivityMainBinding;
import com.example.myparkease2.databinding.ActivityQrCodeBinding;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.journeyapps.barcodescanner.BarcodeEncoder;

public class QrCode extends AppCompatActivity {
    EditText maat  ;
    Button generate , next ;
    ImageView qrcode ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        setContentView(R.layout.activity_qr_code);


        next = findViewById(R.id.next);
        maat=findViewById(R.id.maat);
        generate=findViewById(R.id.generate);
        qrcode=findViewById(R.id.qrcode);

        generate.setOnClickListener(v -> {
            try {
                generateQR();
            } catch (WriterException e) {
                throw new RuntimeException(e);
            }
        });

        next.setOnClickListener(v -> {
            Intent intent = new Intent(QrCode.this, activity_payment.class);
            startActivity(intent);
        });
    }

    private void generateQR() throws WriterException {
        String text = maat.getText().toString().trim();
        MultiFormatWriter writer = new MultiFormatWriter();
        try {


            BitMatrix matrix = writer.encode(text, BarcodeFormat.QR_CODE, 700, 700);
            BarcodeEncoder encoder= new BarcodeEncoder();
            Bitmap bitmap = encoder.createBitmap(matrix);
            qrcode.setImageBitmap(bitmap);
        } catch (WriterException e)
        {

            e.printStackTrace();
        }

    }
}