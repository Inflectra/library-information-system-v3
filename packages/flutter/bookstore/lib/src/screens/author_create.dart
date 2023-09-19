// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';

import '../data.dart';
import '../routing.dart';
import 'package:flutter/services.dart';

class AuthorCreateScreen extends StatefulWidget {

  const AuthorCreateScreen({super.key});

  @override
  State<AuthorCreateScreen> createState() => _AuthorCreateScreenState();
}

class _AuthorCreateScreenState extends State<AuthorCreateScreen> {
  final String title = 'Create New Author';

  final _formKey = GlobalKey<FormState>();
  final _authorNameController = TextEditingController();
  final _authorAgeController = TextEditingController();  
  bool _autoValidate = false;

  bool error = false;
  String errorMessage = "No error";

  _create()
  {
    libraryInstance.createAuthor(_authorNameController.value.text, int.parse(_authorAgeController.value.text)).then((result) {
      RouteStateScope.of(context).go('/authors');
    }).catchError((message) {
      setState(() {
        errorMessage = message;
        error = true;
      });
      Future.delayed(Duration(seconds: 3), () {
        setState(() {
          errorMessage = "";
          error = false;
        });
      });
    });    
  }

  @override
  Widget build(BuildContext context) {

    final theme = Theme.of(context);
    final style = theme.textTheme.labelSmall!.copyWith(
      color: Colors.red,
    );   

    return Scaffold(
        appBar: AppBar(
          title: Text(title),
        ),
        body: Center(
          child: Row(
            children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Form(
                    key: _formKey,   
                    autovalidateMode: _autoValidate ? AutovalidateMode.onUserInteraction : AutovalidateMode.disabled,               
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextFormField(
                          decoration: const InputDecoration(labelText: 'Name', icon: Icon(Icons.person)),
                          controller: _authorNameController,
                          validator: (value) {
                            if (value == null || value.isEmpty)
                            {
                              return "Author name can not be empty";
                            }
                            return null;
                          },                           
                        ),
                        SizedBox(height: 10),
                        TextFormField(
                          decoration: const InputDecoration(labelText: 'Age', icon: Icon(Icons.numbers)),
                          keyboardType: TextInputType.number,
                          inputFormatters: [FilteringTextInputFormatter.allow(RegExp('[1-9][0-9]*'))],                   
                          controller: _authorAgeController,
                          validator: (value) {
                            if (value == null || value.isEmpty)
                            {
                              return "Author age can not be empty";
                            }
                            return null;
                          },                             
                        ),                                       
                        SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Column(
                              children: [
                                ElevatedButton(
                                  onPressed: () async {
                                    if (_formKey.currentState!.validate()) {
                                      _create();
                                    }
                                    else
                                    {
                                      setState(() {
                                        _autoValidate = true;
                                      });
                                    }                                    
                                  },
                                  child: const Text('Create'),
                                ),
                                SizedBox(height: 10),
                                Visibility (
                                  maintainSize: true,
                                  maintainAnimation: true,
                                  maintainState: true,
                                  visible: error,
                                  child: Text(errorMessage, style: style)
                                )                                
                              ],
                            ),
                          ],
                        ),  
                      ]
                    ),
                  )
                )
              )
            ]
          )
        )
      );
  }
}