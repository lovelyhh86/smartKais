package kr.go.juso.smartKais;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class SSO {
    private static final String TAG = "SSO";

    enum SSO_KEY { NICKNAME, DEPARTMENT, DEPARTMENT_NUMBER, OU, OU_CODE, CN, DN }
    static JSONArray reqParam;
    public static final String SSO_TEL = "TEL";
    public static final String SSO_UUID = "UUID";
    private static JSONObject json = null;

    static {
        reqParam = new JSONArray();
        json = new JSONObject();
        try {
            reqParam.put(SSO_KEY.NICKNAME.ordinal(), "gov:nickname");
            reqParam.put(SSO_KEY.DEPARTMENT.ordinal(), "gov:department");
            reqParam.put(SSO_KEY.DEPARTMENT_NUMBER.ordinal(), "gov:departmentnumber");
            reqParam.put(SSO_KEY.OU.ordinal(), "gov:ou");
            reqParam.put(SSO_KEY.OU_CODE.ordinal(), "gov:oucode");
            reqParam.put(SSO_KEY.CN.ordinal(), "gov:cn");
            reqParam.put(SSO_KEY.DN.ordinal(), "gov:dn");
        } catch (JSONException e) { }
    }

    /**
     *
     * @return
     */
    public static JSONObject getSSOInfo() {
        return json;
    }

    public static String getSSOInfo(String name) throws JSONException {
        return json.getString(name);
    }

    public static void setSSOInfo(JSONArray info) {
        Log.d(TAG, info.toString());

        for(SSO_KEY key : SSO_KEY.values()) {
            try {
                int index = key.ordinal();
                String key_code = reqParam.getString(index);
                JSONObject obj = info.getJSONObject(index);
                json.put(key.name(), obj.getString(key_code));
            } catch (JSONException e) { }
        }
    }

    public static void putSSOInfo(String name, Object value) throws JSONException {
        json.put(name, value);
    }

    public static void setSSOInfo(String sso) throws JSONException {
        Log.d(TAG, sso);

        sso = sso.replace("{", "");
        sso = sso.replace("}", "");
        sso = sso.replace("[", "{");
        sso = sso.replace("]", "}");

        setSSOInfo(new JSONObject(sso));
    }

    public static void setSSOInfo(JSONObject sso) throws JSONException {
        for(SSO_KEY key : SSO_KEY.values()) {
            int index = key.ordinal();
            String key_code = reqParam.getString(index);
            json.put(key.name(), sso.getString(key_code));
        }
    }
}
