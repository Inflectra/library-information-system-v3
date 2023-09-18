// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';

import '../data/library.dart';
import '../routing.dart';
import '../widgets/author_list.dart';
import '../auth.dart';
import '../data/author.dart';

class AuthorsScreen extends StatefulWidget {

  const AuthorsScreen({super.key});

  @override
  State<AuthorsScreen> createState() => _AuthorsScreenState();
}

class _AuthorsScreenState extends State<AuthorsScreen> {
  final String title = 'Author Management';

  List<Author> _filteredAuthors = [];
  bool _filteringInProgress = false;

  Future loadAuthors () {
    if (!_filteringInProgress)
    {
      return libraryInstance.loadData();
    }
    else
    {
      return Future.value(_filteredAuthors);
    }
  }  

  @override
  Widget build(BuildContext context) {
    final authState = BookstoreAuthScope.of(context);

   void _runFilter(String enteredKeyword) {
      _filteringInProgress = true;
      List<Author> results = [];
      if (enteredKeyword.isEmpty) {
        // if the search field is empty or only contains white-space, we'll display all users
        results = libraryInstance.allAuthors;
      } else {
        results = libraryInstance.allAuthors
            .where((author) {
              String lcKeyword = enteredKeyword.toLowerCase();
              return author.name.toLowerCase().contains(lcKeyword) || author.age.toString().contains(lcKeyword);
            })
            .toList();
        // we use the toLowerCase() method to make it case-insensitive
      }

      // Refresh the UI
      setState(() {
        _filteredAuthors = results;
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
                tooltip: 'Create new author',
                onPressed: () {
                  RouteStateScope.of(context).go('/createauthor');
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
              child: FutureBuilder (
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
                    _filteredAuthors = libraryInstance.allAuthors;
                  }

                  return AuthorList(
                    authors: _filteredAuthors,
                    onTap: (author) {
                      RouteStateScope.of(context).go('/author/${author.id}');
                    },
                  );
                },
                future: loadAuthors()
              ),
            )],
            if (!authState.signedIn) Padding(
              padding: EdgeInsets.only(left: 20, top: 10, right: 20, bottom: 10),
              child: Text("Please log in to view authors."),
            )            
          ],
        ),
      );
  }
}
