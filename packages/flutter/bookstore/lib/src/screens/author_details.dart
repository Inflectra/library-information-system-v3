// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';

import '../data.dart';
import '../auth.dart';
import '../routing.dart';

class AuthorDetailsScreen extends StatefulWidget {
  final Author author;

  const AuthorDetailsScreen({
    super.key,
    required this.author,
  });

  @override
  State<AuthorDetailsScreen> createState() => _AuthorDetailsScreenState();
}

class _AuthorDetailsScreenState extends State<AuthorDetailsScreen> {

  final _formKey = GlobalKey<FormState>();
  final _authorNameController = TextEditingController();
  final _authorAgeController = TextEditingController();

  bool error = false;
  String errorMessage = "No error";  

  @override
  void initState() {
    super.initState();
    _authorNameController.value = _authorNameController.value.copyWith(text: widget.author.name);
    _authorAgeController.value = _authorAgeController.value.copyWith(text: widget.author.age.toString());
  }  

  void _update()
  {
    libraryInstance.updateAuthor(widget.author, newName: _authorNameController.value.text, newAge: int.parse(_authorAgeController.value.text)).then((result) {
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

    final authState = BookstoreAuthScope.of(context);

    return Scaffold(
    appBar: AppBar(
      title: Text(authState.isEditor() ? "Author Edit" : "Author Information"),
    ),
    body: Center(
      child: Row(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(15.0),
              child: Form(
                key: _formKey,
                autovalidateMode: AutovalidateMode.onUserInteraction,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (!authState.isEditor()) ...[
                      TextFormField(
                        readOnly: true,
                        decoration: InputDecoration(labelText: 'Name', icon: Icon(Icons.person), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                        initialValue: widget.author.name
                      ),                    
                      SizedBox(height: 10),
                      TextFormField(
                        readOnly: true,
                        decoration: InputDecoration(labelText: 'Age', icon: Icon(Icons.numbers), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                        initialValue: widget.author.age.toString()
                      ),                     
                    ]
                    else ...[
                      TextFormField(
                        decoration: InputDecoration(labelText: 'Name', icon: Icon(Icons.person)),
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
                        decoration: InputDecoration(labelText: 'Age', icon: Icon(Icons.numbers)),
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
                                    _update();
                                  }
                                },
                                child: const Text('Update'),
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
                    ],
                    SizedBox(height: 20),
                    if (widget.author.books.isNotEmpty) TextFormField(
                      readOnly: true,
                      enableInteractiveSelection: false,
                      decoration: InputDecoration(icon: Icon(Icons.library_books), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                      initialValue: "Books (${widget.author.books.length})"
                    ),    
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        for(Book book in widget.author.books) ...[
                          Padding(
                            padding: const EdgeInsets.only(left: 40),
                            child: Text(
                              style: Theme.of(context).textTheme.titleMedium,
                              book.name,
                            ),
                          )
                        ]
                      ],
                    )                       
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );
  }
}
