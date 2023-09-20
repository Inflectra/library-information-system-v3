// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:flutter/services.dart'; 
import 'package:flutter/foundation.dart' show kIsWeb;

import '../auth.dart';
import '../services/backend_service.dart';

class AccountScreen extends StatefulWidget {

  const AccountScreen({
    super.key,
  });

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {

  final String title = 'Account Information';

  final getIt = GetIt.instance;
  final _serverUrlController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();  

  bool error = false;
  String errorMessage = "No error";  

  @override
  void initState() {
    super.initState();
    _serverUrlController.value = _serverUrlController.value.copyWith(text: getIt.get<BackendService>().getOrganization());

    if (kIsWeb && Uri.base.pathSegments.length == 3)
    {
      _serverUrlController.value = _serverUrlController.value.copyWith(text: Uri.base.pathSegments[0]);
    }
    //_usernameController.value = _usernameController.value.copyWith(text: "librarian");
    //_passwordController.value = _passwordController.value.copyWith(text: "librarian");
  }  

  _signIn(BookstoreAuth authState)
  {
    authState.signIn(_serverUrlController.value.text, _usernameController.value.text, _passwordController.value.text).then((signedIn) {
      if (!signedIn) {
        print("LogIn unsuccessful, let's show the error message");
        setState(() {
          errorMessage = getIt.get<BackendService>().getLastError();
          error = true;
        });
        Future.delayed(Duration(seconds: 3), () {
          setState(() {
            errorMessage = "";
            error = false;
          });
        });
      } else {
        if (kIsWeb)
        {
          SystemChrome.setApplicationSwitcherDescription(ApplicationSwitcherDescription(
            label: "LIS: ${authState.getOrganizationName()}" ,
            primaryColor: Theme.of(context).primaryColor.value,
          ));
        }
      }
    });
  }

  _signOut(BookstoreAuth authState)
  {
    authState.signOut().then((signedIn) {
      if (signedIn) {
        print("LogOut unsuccessful, let's show the error message");
        setState(() {
          errorMessage = getIt.get<BackendService>().getLastError();
          error = true;
        });
        Future.delayed(Duration(seconds: 3), () {
          setState(() {
            errorMessage = "";
            error = false;
          });
        });
      } else {
        setState(() {
          _usernameController.value = _usernameController.value.copyWith(text: "");
          _passwordController.value = _passwordController.value.copyWith(text: "");
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final style = theme.textTheme.labelSmall!.copyWith(
      color: Colors.red,
    );   
    final authState = BookstoreAuthScope.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),    
      body: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (!authState.signedIn) Container(
            constraints: BoxConstraints.loose(const Size(600, 600)),
            padding: const EdgeInsets.all(15),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (kIsWeb && Uri.base.pathSegments.length == 3) ...[
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Organization', icon: Icon(Icons.factory)),
                    controller: _serverUrlController,
                    readOnly: true,
                  )
                ]
                else ...[
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Organization', icon: Icon(Icons.factory)),
                    controller: _serverUrlController,
                  )
                ],            
                TextFormField(
                  decoration: const InputDecoration(labelText: 'User Name', icon: Icon(Icons.person)),
                  controller: _usernameController,
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Password', icon: Icon(Icons.password)),
                  obscureText: true,
                  controller: _passwordController,
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: ElevatedButton(
                    onPressed: () async {
                      _signIn(authState);
                    },
                    child: const Text('Log In'),
                  ),
                ),
              ],
            ),
          ),
          if (authState.signedIn) Container(
            constraints: BoxConstraints.loose(const Size(600, 600)),
            padding: const EdgeInsets.all(15),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextFormField(
                        readOnly: true,
                        decoration: InputDecoration(labelText: 'Organization', icon: Icon(Icons.factory), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                        initialValue: authState.getOrganizationName()
                      ),                    
                      SizedBox(height: 10),                      
                      TextFormField(
                        readOnly: true,
                        decoration: InputDecoration(labelText: 'Name', icon: Icon(Icons.person), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                        initialValue: authState.getUserName()
                      ),                    
                      SizedBox(height: 10),
                      TextFormField(
                        readOnly: true,
                        decoration: InputDecoration(labelText: 'Role', icon: Icon(Icons.perm_identity), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                        initialValue: authState.isAdmin() ? "Admin" : (authState.isEditor() ? "Editor" : "Borrower")
                      ),              
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: ElevatedButton(
                          onPressed: () async {
                            _signOut(authState);
                          },
                          child: const Text('Log Out'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Visibility (
            maintainSize: true,
            maintainAnimation: true,
            maintainState: true,
            visible: error,
            child: Text(errorMessage, style: style)
          )
        ]
      )
    );
  }
}
