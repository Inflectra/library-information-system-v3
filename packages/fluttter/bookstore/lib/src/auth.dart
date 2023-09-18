// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'dart:convert';
import 'package:bookstore/src/services/backend_service.dart';
import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';
import './data.dart';

/// A mock authentication service
class BookstoreAuth extends ChangeNotifier {
  final getIt = GetIt.instance;
  
  late BackendService backendService;
  User? user;
  bool _signedIn = false;
  bool get signedIn => _signedIn;

  BookstoreAuth()
  {
    backendService = getIt<BackendService>();
  }

  bool isAdmin() {
    if (user != null && user!.permission  == Permissions.admin) {
      return true;
    }
    return false;
  }

  bool isEditor() {
    if (user != null && (user!.permission  == Permissions.edit || user!.permission == Permissions.admin)) {
      return true;
    }
    return false;
  }  

  String getUserName() {
    if(user != null && user!.name.isNotEmpty) {
      return user!.name;
    }
    return "TBD";
  }  

  Future<bool> signIn(String url, String username, String password) async {
    backendService.updateBackendUrl(url);
    //var query = 'users/login?username=$username&password=$password';
    var authHeader = "Basic " + base64.encode(utf8.encode("$username:$password"));
    _signedIn = false;
    return backendService.getDataFromBackend("users/login", "get", null, {"Authorization": authHeader }).then((response) {
      backendService.setToken(response["token"]);
      _signedIn = true;
      notifyListeners();
      user = User(response["username"], response["password"], response["name"], response["active"], response["permission"]);
      return _signedIn;
    }).catchError((error) {
      return _signedIn;
    });
  }

  Future<bool> signOut() async {
    return backendService.getDataFromBackend("users/logout").then((response) {
     backendService.clearToken();
      _signedIn = false;
      notifyListeners();
      return _signedIn;
    }).catchError((error) {
      return _signedIn;
    });
  }

  @override
  bool operator ==(Object other) =>
      other is BookstoreAuth && other._signedIn == _signedIn;

  @override
  int get hashCode => _signedIn.hashCode;
}

class BookstoreAuthScope extends InheritedNotifier<BookstoreAuth> {
  const BookstoreAuthScope({
    required super.notifier,
    required super.child,
    super.key,
  });

  static BookstoreAuth of(BuildContext context) => context
      .dependOnInheritedWidgetOfExactType<BookstoreAuthScope>()!
      .notifier!;
}

abstract class Permissions {
  static int none = 0;
  static int view = 1;
  static int edit = 2;
  static int admin = 3;
} 
