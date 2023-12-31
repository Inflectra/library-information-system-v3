import 'dart:io';
import 'dart:convert';
import 'package:bookstore/src/data/library.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'http_client_default.dart' if (dart.library.html) 'http_client_browser.dart';

class BackendService {

  String _errorMessage = "";
  String _token = "";
  String _cookie = "";
  String _serverUrl = "";

  String getOrganization()
  {
    String? organization = Library.localStorage?.getString("Organization");
    return organization ?? "";
  }

  void updateOrganization(String organization)
  {
    if (organization.startsWith("http") && !organization.endsWith("/"))
    {
      organization += "/";
    }

    Library.localStorage!.setString("Organization", organization);
    _serverUrl = "";
    _serverUrl = getBackendUrl();
  }  

  String getBackendUrl() 
  {
    if (_serverUrl.isEmpty) 
    {
      String? organization = Library.localStorage!.getString("Organization");
      if (organization != null)
      {
        if (!organization.startsWith("http"))
        {
          if (organization.isEmpty)
          {
            _serverUrl = "https://v3.libraryinformationsystem.org/api/";
          }
          else if (organization == "localhost")
          {
            String localhost = "http://localhost:5003/api/";
            String androidLocalhost = "http://10.0.2.2:5003/api/";
            String iosLocalhost = "http://0.0.0.0:5003/api/";

            if (kIsWeb)
            {
              _serverUrl = localhost;
            }
            else if (Platform.isAndroid) {
              _serverUrl = androidLocalhost;
            } else if (Platform.isIOS) {
              _serverUrl = iosLocalhost;
            } else {
              _serverUrl = localhost;
            }
          }
          else
          {
            _serverUrl = "https://v3.libraryinformationsystem.org/$organization/api/";
          }
        }
        else
        {
          _serverUrl = organization;
        }
      }
    }
    return _serverUrl;
  }

  String getLastError()
  {
    return _errorMessage;    
  }

  void setLastError(String error)
  {
    _errorMessage = error;
  }

  void setToken(newToken)
  {
    _token = newToken;
  }

  void clearToken()
  {
    _token = "";
    _cookie = "";
  }

  Future<dynamic> _processResponse(http.Response response)
  {
    if (response.statusCode == 200) {

      if (response.headers.keys.contains("set-cookie"))
      {
        _cookie = response.headers["set-cookie"]!;
        print("Set-Cookie: $_cookie");

        int index = _cookie.indexOf(';');
        _cookie = (index == -1) ? _cookie : _cookie.substring(0, index);
      }

      if (response.body != "")
      {
        var jsonData = jsonDecode(response.body);
        return Future.value(jsonData);
      }
      return Future.value(0);
    } else {
      if (response.body.isNotEmpty)
      {
        try
        {
        var jsonData = jsonDecode(response.body);
        if (_hasPropertyOrKey(jsonData, "errorMessage"))
        {
          _errorMessage = jsonData["errorMessage"];
        }
        else
        {
          _errorMessage = response.body;
        }
        }
        catch(e)
        {
          _errorMessage = "(${response.statusCode}): ${response.reasonPhrase ?? "n/a"}";
        }
      }
      else
      {
        _errorMessage = "(${response.statusCode}): ${response.reasonPhrase ?? "n/a"}";
      }
      print("Backend error: $_errorMessage");
      return Future.error(_errorMessage);
    }
  }

  bool _hasPropertyOrKey(dynamic obj, String name)
  {
    if (obj == null)
    {
      return false;
    }

    if (obj is Map)
    {
      return obj.containsKey(name);
    }

    var hasProperty = false;
    try {
      obj.property;
      hasProperty = true;
    }
    catch(e)
    {
      // no such property
    }   
    return hasProperty;
  }

  void _processError(error)
  {
    if (_hasPropertyOrKey(error, "message"))
    {
      if (error.message.toString().contains("The semaphore timeout period has expired"))
      {
        _errorMessage = "Unable to connect to $_serverUrl";
      }
      else
      {
        _errorMessage = error.message;
      }
    }
    else
    {
      _errorMessage = error.toString();
    }
    print("Backend error: $_errorMessage");
    throw(_errorMessage);
  }

  Future<dynamic> getDataFromBackend(String query, [String method = "get", String? postData, Map<String, String>? additionalHeaders]) async {
    _errorMessage = "";
    var backendUrl = getBackendUrl();
    var url = backendUrl + query;

    print('Query: $query');

    Map<String, String> headers = {'Content-Type': 'application/json'};

    if (_token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_token';
    }

    if (_cookie.isNotEmpty) {
      headers['Cookie'] = _cookie;
    }

    if (additionalHeaders != null)
    {
       additionalHeaders.forEach((key, value) { 
         headers[key] = value;
       });

    }   
    
    var uri = Uri.parse(url);

    if (method == "get")
    {
      return client.get(uri, headers: headers).then(_processResponse).catchError(_processError);
    }
    else if (method == "delete")
    {
      return client.delete(uri, headers: headers).then(_processResponse).catchError(_processError);
    }
    else if (method == "put")
    {
      return client.put(uri, headers: headers, body: postData).then(_processResponse).catchError(_processError);
    }
    else if (method == "post")
    {
      return client.post(uri, headers: headers, body: postData).then(_processResponse).catchError(_processError);
    }    

  }
}
