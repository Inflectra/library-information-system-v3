// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';

import '../data.dart';
import '../routing.dart';
import '../widgets/book_list.dart';
import '../auth.dart';

class BooksScreen extends StatefulWidget {

  const BooksScreen({super.key});

  @override
  State<BooksScreen> createState() => _BooksScreenState();
}

class _BooksScreenState extends State<BooksScreen> {
  final String title = 'Book Management';

  List<Book> _filteredBooks = [];
  bool _filteringInProgress = false;

  Future loadBooks () {
    if (!_filteringInProgress)
    {
      return libraryInstance.loadData();
    }
    else
    {
      return Future.value(_filteredBooks);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = BookstoreAuthScope.of(context);

    void _runFilter(String enteredKeyword) {
      _filteringInProgress = true;
      List<Book> results = [];
      if (enteredKeyword.isEmpty) {
        // if the search field is empty or only contains white-space, we'll display all users
        results = libraryInstance.allBooks;
      } else {
        results = libraryInstance.allBooks
            .where((book) {
              String lcKeyword = enteredKeyword.toLowerCase();
              return book.name.toLowerCase().contains(lcKeyword) || book.author.name.toLowerCase().contains(lcKeyword) || book.genre.name.toLowerCase().contains(lcKeyword);
            })
            .toList();
        // we use the toLowerCase() method to make it case-insensitive
      }

      // Refresh the UI
      setState(() {
        _filteredBooks = results;
      });
    }    

    return Scaffold(
        appBar: AppBar(
          title: Text(title),
          actions: [
            if (authState.isEditor()) Padding(
              padding: const EdgeInsets.only(right: 10),
              child: IconButton(
                icon: const Icon(Icons.add),
                tooltip: 'Create new book',
                onPressed: () {
                  RouteStateScope.of(context).go('/createbook');
                },
              ),
            ),
          ],          
        ),
        body: Column(
          children: [
            if (authState.signedIn) ...[
              Padding(
                padding: const EdgeInsets.only(left: 15, right: 15),
                child: Column(
                    children: [
                      TextField(
                        onChanged: (value) => _runFilter(value),
                        decoration: const InputDecoration(
                            labelText: 'Search', suffixIcon: Icon(Icons.search)),
                      ),
                      const SizedBox(
                        height: 20,
                      ),                  
                    ],
                ),
              ),              
              Expanded(
                child: FutureBuilder(
                  builder: (context, snapshot) {

                    // in progress
                    if (!snapshot.hasData) {
                      return Center(child: CircularProgressIndicator());
                    }         

                    // error
                    if (snapshot.hasError) {
                      return Center(child: Text(snapshot.error.toString()));
                    }

                    if (!_filteringInProgress)
                    {
                      _filteredBooks = libraryInstance.allBooks;
                    }

                    // success
                    return BookList(
                      books: _filteredBooks,
                      onTap: (book) {
                        RouteStateScope.of(context).go('/book/${book.id}');
                      });
                  },
                  future: loadBooks()
                )
              )
            ],
            if (!authState.signedIn) Padding(
              padding: EdgeInsets.only(left: 20, top: 10, right: 20, bottom: 10),
              child: Text("Please log in to view books."),
            )
          ],
        ),
      );
  }
}