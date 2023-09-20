// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';

import '../auth.dart';

class HomeScreen extends StatelessWidget {

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {

    final authState = BookstoreAuthScope.of(context);

    return Scaffold(
        appBar: AppBar(
          title: Text(authState.signedIn ? "Welcome, ${authState.getUserName()}!" : "Welcome"),
        ),
        body: Column(
          children: [
            Padding(
              padding: EdgeInsets.only(left: 20, top: 10, right: 20, bottom: 10),
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.blueGrey),
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.orange[50]
                ),
                child: RichText(
                  text: TextSpan(
                    style: const TextStyle(
                      fontSize: 14.0,
                      color: Colors.black,
                    ),                  
                    children: [
                        TextSpan(text: "This sample application lets you "),
                        TextSpan(text: "view, create and edit books ", style: const TextStyle(fontWeight: FontWeight.bold)),
                        TextSpan(text: "in the library catalog as well as "),
                        TextSpan(text: "view, create and edit authors", style: const TextStyle(fontWeight: FontWeight.bold)),
                        TextSpan(text: ".")
                    ]
                  ),
                ),
              ),
            ),
            SizedBox(height: 10),
            Padding(
              padding: EdgeInsets.only(left: 20, top: 0, right: 20, bottom: 0),
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.blueGrey),
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.lightBlue[50]
                ),
                child: RichText(
                  text: TextSpan(
                    style: const TextStyle(
                      fontSize: 14.0,
                      color: Colors.black,
                    ),                  
                    children: [
                      TextSpan(text: "To view the library catalog or the authors list you will need to login as a "),
                      TextSpan(text: "borrower ", style: const TextStyle(fontWeight: FontWeight.bold)),
                      TextSpan(text: "and to make changes to the list of books or authors you will need to login as a "),
                      TextSpan(text: "librarian", style: const TextStyle(fontWeight: FontWeight.bold)),
                      TextSpan(text: ".")
                    ]
                  ),
                ),
              ),
            )
          ]
        )
      );
  }
}