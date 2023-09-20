// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';

import '../data.dart';
import '../auth.dart';
import '../routing.dart';

class BookDetailsScreen extends StatefulWidget {
  final Book? book;

  const BookDetailsScreen({
    super.key,
    this.book,
  });

  @override
  State<BookDetailsScreen> createState() => _BookDetailsScreenState();
}

class _BookDetailsScreenState extends State<BookDetailsScreen> {

  final _formKey = GlobalKey<FormState>();
  final _bookNameController = TextEditingController();
  String? _selectedAuthorId;
  String? _selectedGenreId;

  bool error = false;
  String errorMessage = "No error";      

  @override
  void initState() {
    super.initState();
    _selectedAuthorId = widget.book?.author.id.toString();
    _selectedGenreId = widget.book?.genre.id.toString();
    _bookNameController.value = _bookNameController.value.copyWith(text: widget.book?.name);
  }  

  void _update()
  {
    libraryInstance.updateBook(widget.book!, newName: _bookNameController.value.text, newAuthorId: int.parse(_selectedAuthorId!), newGenreId: int.parse(_selectedGenreId!)).then((result) {
      RouteStateScope.of(context).go('/books');
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

  void _delete(BuildContext context) {
    showDialog(
        context: context,
        builder: (BuildContext ctx) {
          return AlertDialog(
            title: const Text('Please Confirm'),
            content: const Text('Are you sure to delete the book?'),
            actions: [
              // The "Yes" button
              TextButton(
                  onPressed: () {
                    // Delete the book
                    libraryInstance.deleteBook(widget.book!).then((result) {
                      // Close the dialog
                      Navigator.of(context).pop();
                      // Navigate to the book list
                      RouteStateScope.of(context).go('/books');
                    });
                  },
                  child: const Text('Yes')),
              TextButton(
                  onPressed: () {
                    // Close the dialog
                    Navigator.of(context).pop();
                  },
                  child: const Text('No'))
            ],
          );
        });
  }

  @override
  Widget build(BuildContext context) {
    if (widget.book == null) {
      return const Scaffold(
        body: Center(
          child: Text('No book found.'),
        ),
      );
    }

    final theme = Theme.of(context);
    final style = theme.textTheme.labelSmall!.copyWith(
      color: Colors.red,
    );  

    final authState = BookstoreAuthScope.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(authState.isEditor() ? "Book Edit" : "Book Information"),
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
                          decoration: InputDecoration(labelText: 'Title', icon: Icon(Icons.title), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                          initialValue: widget.book!.name
                        ),                    
                        SizedBox(height: 10),
                        TextFormField(
                          readOnly: true,
                          decoration: InputDecoration(labelText: 'Author', icon: Icon(Icons.person), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                          initialValue: widget.book!.author.name
                        ),                    
                        SizedBox(height: 10),
                        TextFormField(
                          readOnly: true,
                          decoration: InputDecoration(labelText: 'Genre', icon: Icon(Icons.type_specimen), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                          initialValue: widget.book!.genre.name
                        ),                    
                        SizedBox(height: 10),
                        TextFormField(
                          readOnly: true,
                          decoration: InputDecoration(labelText: 'Date Added', icon: Icon(Icons.calendar_month), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                          initialValue: widget.book!.dateAdded
                        ),                  
                        SizedBox(height: 10),
                        TextFormField(
                          readOnly: true,
                          decoration: InputDecoration(labelText: 'Availability', icon: widget.book!.outOfPrint ? Icon(Icons.print_disabled) : Icon(Icons.print), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                          initialValue: widget.book!.outOfPrint ? "Out of print" : "In stock"
                        ),  
                      ]
                      else ...[
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
                        ),
                        SizedBox(height: 10),
                        TextFormField(
                          readOnly: true,
                          decoration: InputDecoration(labelText: 'Date Added', icon: Icon(Icons.calendar_month), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                          initialValue: widget.book!.dateAdded
                        ),                  
                        SizedBox(height: 10),
                        TextFormField(
                          readOnly: true,
                          decoration: InputDecoration(labelText: 'Availability', icon: widget.book!.outOfPrint ? Icon(Icons.print_disabled) : Icon(Icons.print), focusedBorder: InputBorder.none, enabledBorder: InputBorder.none,),
                          initialValue: widget.book!.outOfPrint ? "Out of print" : "In stock"
                        ),                
                        SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Column(
                              children: [
                                Row(
                                  children: [
                                    ElevatedButton(
                                      onPressed: () async {
                                        if (_formKey.currentState!.validate()) {
                                          _update();
                                        }
                                      },
                                      child: const Text('Update'),
                                    ),
                                    SizedBox(width: 10),
                                    ElevatedButton(
                                      onPressed: () async {
                                        _delete(context);
                                      },
                                      child: const Text('Delete'),
                                    ),
                                  ],
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
