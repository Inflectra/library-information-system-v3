// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import '../services/backend_service.dart';

class Credentials {
  final String username;
  final String password;

  Credentials(this.username, this.password);
}

class SignInScreen extends StatefulWidget {
  final Future<bool> Function(Credentials) onSignIn;

  const SignInScreen({
    required this.onSignIn,
    super.key,
  });

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  
  final getIt = GetIt.instance;
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  bool error = false;
  String errorMessage = "No error";

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final style = theme.textTheme.labelSmall!.copyWith(
      color: Colors.red,
    );

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Card(
              child: Container(
                constraints: BoxConstraints.loose(const Size(600, 600)),
                padding: const EdgeInsets.all(8),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Log In',
                        style: Theme.of(context).textTheme.headlineMedium),
                    TextField(
                      decoration: const InputDecoration(labelText: 'Username'),
                      controller: _usernameController,
                    ),
                    TextField(
                      decoration: const InputDecoration(labelText: 'Password'),
                      obscureText: true,
                      controller: _passwordController,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: TextButton(
                        onPressed: () async {
                          widget
                              .onSignIn(Credentials(
                                  _usernameController.value.text,
                                  _passwordController.value.text))
                              .then((signedIn) {
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
                                }
                                return signedIn;
                          });
                        },
                        child: const Text('Log In'),
                      ),
                    ),
                  ],
                ),
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
      ),
    );
  }
}
