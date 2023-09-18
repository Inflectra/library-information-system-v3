// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';

import '../data.dart';
import '../routing.dart';

class BookCreateScreen extends StatefulWidget {

  const BookCreateScreen({super.key});

  @override
  State<BookCreateScreen> createState() => _BookCreateScreenState();
}

class _BookCreateScreenState extends State<BookCreateScreen> {
  final String title = 'Create New Book';
  final _formKey = GlobalKey<FormState>();
  
  final _bookNameController = TextEditingController();
  String? _selectedAuthorId;
  String? _selectedGenreId;  
  bool _autoValidate = false;

  _create()
  {
    libraryInstance.createBook(_bookNameController.value.text, int.parse(_selectedAuthorId!), int.parse(_selectedGenreId!)).then((result) {
      RouteStateScope.of(context).go('/books');
    });    
  }

  @override
  Widget build(BuildContext context) => Scaffold(
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
                          decoration: InputDecoration(labelText: 'Title', icon: Icon(Icons.title)),
                          controller: _bookNameController,
                          validator: (value) {
                            if (value == null || value.isEmpty)
                            {
                              return "Book title can not be empty";
                            }
                            return null;
                          },                            
                        ),
                        SizedBox(height: 10),
                        DropdownButtonFormField<String>(
                          decoration: InputDecoration(labelText: 'Author', icon: Icon(Icons.person)),
                          isExpanded: true,
                          items: libraryInstance.allAuthors.map((Author author) {
                            return DropdownMenuItem<String>(
                              value: author.id.toString(),
                              child: Text(author.name),
                            );
                          }).toList(),
                          hint: const Text("Select Author"),
                          value: _selectedAuthorId,
                          onChanged: (String? val) {
                            setState(() {
                              _selectedAuthorId = val!;
                            });
                          },
                          validator: (value) {
                            if (_selectedAuthorId == null)
                            {
                              return "Please select book author";
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 10),
                        DropdownButtonFormField<String>(
                          decoration: InputDecoration(labelText: 'Genre', icon: Icon(Icons.type_specimen)),
                          isExpanded: true,
                          items: libraryInstance.allGenres.map((Genre genre) {
                            return DropdownMenuItem<String>(
                              value: genre.id.toString(),
                              child: Text(genre.name),
                            );
                          }).toList(),
                          hint: const Text("Select Genre"),
                          value: _selectedGenreId,
                          onChanged: (String? val) {
                            setState(() {
                              _selectedGenreId = val!;
                            });
                          },
                          validator: (value) {
                            if (_selectedAuthorId == null)
                            {
                              return "Please select book genre";
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