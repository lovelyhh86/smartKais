package kr.go.juso.smartKais;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;
import java.lang.String;
import java.net.URLDecoder;
import java.util.HashMap;

import android.annotation.TargetApi;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import android.os.Environment;
import android.content.pm.PackageManager;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.database.Cursor;

import android.content.ActivityNotFoundException;
import android.util.Log;

public class FileOpener  {
    private static final String FILE_OPENER = "FileOpener";
    private static final HashMap<String, String> MIME_TYPES;

    static {
        MIME_TYPES = new HashMap<String, String>();
        MIME_TYPES.put(".djvu", "image/x.djvu");
        MIME_TYPES.put(".pdf", "application/pdf");
        MIME_TYPES.put(".doc", "application/msword");
        MIME_TYPES.put(".docx", "application/msword");
        MIME_TYPES.put(".xls", "application/vnd.ms-powerpoint");
        MIME_TYPES.put(".xlsx", "application/vnd.ms-powerpoint");
        MIME_TYPES.put(".rtf", "application/vnd.ms-excel");
        MIME_TYPES.put(".wav", "audio/x-wav");
        MIME_TYPES.put(".mp3", "audio/mpeg3");
        MIME_TYPES.put(".gif", "image/gif");
        MIME_TYPES.put(".jpg", "image/jpeg");
        MIME_TYPES.put(".jpeg", "image/jpeg");
        MIME_TYPES.put(".png", "image/png");
        MIME_TYPES.put(".txt", "text/plain");
        MIME_TYPES.put(".tiff", "image/tiff");
        MIME_TYPES.put(".tif", "image/tiff");
        MIME_TYPES.put(".mpg", "video/*");
        MIME_TYPES.put(".mpeg", "video/*");
        MIME_TYPES.put(".mpe", "video/*");
        MIME_TYPES.put(".mp4", "video/*");
        MIME_TYPES.put(".avi", "video/*");
        MIME_TYPES.put(".flv", "video/*");
        MIME_TYPES.put(".ods", "application/vnd.oasis.opendocument.spreadsheet");
        MIME_TYPES.put(".odt", "application/vnd.oasis.opendocument.text");
        MIME_TYPES.put(".ppt", "application/vnd.ms-powerpoint");
        MIME_TYPES.put(".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
        MIME_TYPES.put(".apk", "application/vnd.android.package-archive");
        MIME_TYPES.put(".swf", "application/x-shockwave-flash");
        MIME_TYPES.put(".zip", "application/zip");
        MIME_TYPES.put(".rar", "application/x-rar-compressed");
    }


    private String getExtension(final JSONArray args, CallbackContext callbackContext) throws JSONException {
        JSONObject obj = new JSONObject();
        if (args.length() > 0) {
            String url = args.getString(0);
            if (url.lastIndexOf(".") > -1) {
                String extension = url.substring(url.lastIndexOf("."));
                if (hasMimeType(extension)) {
                    return extension;
                } else {
                    obj.put("message", "This extension: " + extension + " is not supported by the FileOpener plugin");
                    callbackContext.error(obj);
                    return null;
                }
            } else {
                obj.put("message", "This file :" + url + " has no extension");
                callbackContext.error(obj);
                return null;
            }
        } else {
            obj.put("message", "Parameter is missing");
            callbackContext.error(obj);
            return null;
        }
    }

    private boolean hasMimeType(String extension) {
        return MIME_TYPES.containsKey(extension);
    }

    private String getMimeType(String extension) {
        return MIME_TYPES.get(extension);
    }

    private boolean canOpenFile(String extension, Context context) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        final File tempFile = new File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "test" + extension);
        intent.setDataAndType(Uri.fromFile(tempFile), getMimeType(extension));
        return context.getPackageManager().queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY).size() > 0;
    }

    private void openFile(Uri localUri, String extension, Context context, CallbackContext callbackContext) throws JSONException {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setDataAndType(localUri, getMimeType(extension));
        JSONObject obj = new JSONObject();

        try {
            context.startActivity(intent);
            obj.put("message", "successfull downloading and openning");
            callbackContext.success(obj);
        } catch (ActivityNotFoundException e) {
            obj.put("message", "Failed to open the file, no reader found");
            obj.put("ActivityNotFoundException", e.getMessage());
            callbackContext.error(obj);
        }
    }

    public void downloadAndOpenFile(final Context context, final String fileUrl, final CallbackContext callbackContext) throws UnsupportedEncodingException {
        final String filename = "smartkais.apk"; //URLDecoder.decode(fileUrl.substring(fileUrl.lastIndexOf("/") + 1), "UTF-8");
        final String extension = "apk";//fileUrl.substring(fileUrl.lastIndexOf("."));
        final File tempFile = new File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), filename);

        if (tempFile.exists()) {

                tempFile.delete();
                //openFile(Uri.fromFile(tempFile), extension, context, callbackContext);

           // return;
        }

        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(fileUrl));
        request.setDestinationInExternalPublicDir( Environment.DIRECTORY_DOWNLOADS, filename);
        final DownloadManager downloadManager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
        BroadcastReceiver onComplete = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                context.unregisterReceiver(this);

                long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                Cursor cursor = downloadManager.query(new DownloadManager.Query().setFilterById(downloadId));

                if (cursor.moveToFirst()) {
                    int status = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS));
                    if (status == DownloadManager.STATUS_SUCCESSFUL) {
                        try {
                            openFile(Uri.fromFile(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)), extension, context, callbackContext);
                        } catch (JSONException e) {
                            Log.d(FILE_OPENER, "downloadAndOpenFile", e);
                        }
                    } else if (status == DownloadManager.STATUS_FAILED) {
                        manageDownloadStatusFailed(cursor, callbackContext);
                    }
                }
                cursor.close();
            }
        };
        context.registerReceiver(onComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));

        downloadManager.enqueue(request);
    }

    private void manageDownloadStatusFailed(Cursor cursor, CallbackContext callbackContext) {
        int reason = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_REASON));
        String failedReason = "";

        switch (reason) {
            case DownloadManager.ERROR_CANNOT_RESUME:
                failedReason = "ERROR_CANNOT_RESUME";
                break;
            case DownloadManager.ERROR_DEVICE_NOT_FOUND:
                failedReason = "ERROR_DEVICE_NOT_FOUND";
                break;
            case DownloadManager.ERROR_FILE_ALREADY_EXISTS:
                failedReason = "ERROR_FILE_ALREADY_EXISTS";
                break;
            case DownloadManager.ERROR_FILE_ERROR:
                failedReason = "ERROR_FILE_ERROR";
                break;
            case DownloadManager.ERROR_HTTP_DATA_ERROR:
                failedReason = "ERROR_HTTP_DATA_ERROR";
                break;
            case DownloadManager.ERROR_INSUFFICIENT_SPACE:
                failedReason = "ERROR_INSUFFICIENT_SPACE";
                break;
            case DownloadManager.ERROR_TOO_MANY_REDIRECTS:
                failedReason = "ERROR_TOO_MANY_REDIRECTS";
                break;
            case DownloadManager.ERROR_UNHANDLED_HTTP_CODE:
                failedReason = "ERROR_UNHANDLED_HTTP_CODE";
                break;
            case DownloadManager.ERROR_UNKNOWN:
                failedReason = "ERROR_UNKNOWN";
                break;
            case 400:
                failedReason = "BAD_REQUEST";
                break;
            case 401:
                failedReason = "UNAUTHORIZED";
                break;
            case 404:
                failedReason = "NOT_FOUND";
                break;
            case 500:
                failedReason = "INTERNAL_SERVER_ERROR";
                break;
        }

        JSONObject obj = new JSONObject();
        try {
            obj.put("message", "Download failed for reason: #" + reason + " " + failedReason);
            callbackContext.error(obj);
        } catch (JSONException e) {
            Log.d(FILE_OPENER, "downloadAndOpenFile", e);
        }
    }
}
