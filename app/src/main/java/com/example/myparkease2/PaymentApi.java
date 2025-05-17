package com.example.myparkease2;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;
public interface PaymentApi {
    @FormUrlEncoded
    @POST("add_payment.php") // Remplacez avec le bon chemin de votre API
    Call<ApiResponse> addPayment(
            @Field("user_id") int userId,
            @Field("card_number") String cardNumber,
            @Field("expiry_date") String expiryDate,
            @Field("card_holder_name") String cardHolderName
    );
}
