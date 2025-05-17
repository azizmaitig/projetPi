package com.example.myparkease2;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class JsonParser {

    private HashMap<String, String> parseJsonObject(JSONObject object) {
        // Initialize hash map
        HashMap<String, String> dataList = new HashMap<>();

        try {
            // Get name from object
            String name = object.getString("name");

            // Get latitude from object
            String latitude = object.getJSONObject("geometry")
                    .getJSONObject("location").getString("lat");

            // Get longitude from object
            String longitude = object.getJSONObject("geometry")
                    .getJSONObject("location").getString("lng");

            // Put all values in hash map
            dataList.put("name", name);
            dataList.put("lat", latitude);
            dataList.put("lng", longitude);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return dataList;
    }

    private List<HashMap<String, String>> parseJsonArray(JSONArray jsonArray) {
        List<HashMap<String, String>> dataList = new ArrayList<>();

        for (int i = 0; i < jsonArray.length(); i++) {
            try {
                HashMap<String, String> data = parseJsonObject((JSONObject) jsonArray.get(i));
                dataList.add(data);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return dataList;
    }

    public List<HashMap<String, String>> parseResult(JSONObject object) {
        // Initialize JSON array
        JSONArray jsonArray = null;

        // Get result array
        try {
            jsonArray = object.getJSONArray("results");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return parseJsonArray(jsonArray);
    }
}
