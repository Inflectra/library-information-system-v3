// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:collection/collection.dart';
import 'package:flutter/material.dart';

import '../data.dart';
import '../routing.dart';
import '../widgets/fade_transition_page.dart';
import 'author_details.dart';
import 'book_details.dart';
import 'book_create.dart';
import 'author_create.dart';
import 'scaffold.dart';

/// Builds the top-level navigator for the app. The pages to display are based
/// on the `routeState` that was parsed by the TemplateRouteParser.
class BookstoreNavigator extends StatefulWidget {
  final GlobalKey<NavigatorState> navigatorKey;

  const BookstoreNavigator({
    required this.navigatorKey,
    super.key,
  });

  @override
  State<BookstoreNavigator> createState() => _BookstoreNavigatorState();
}

class _BookstoreNavigatorState extends State<BookstoreNavigator> {
  final _scaffoldKey = const ValueKey('App scaffold');
  final _bookDetailsKey = const ValueKey('Book details screen');
  final _authorDetailsKey = const ValueKey('Author details screen');
  final _bookCreateKey = const ValueKey('Book create screen');
  final _authorCreateKey = const ValueKey('Author create screen');  

  @override
  Widget build(BuildContext context) {
    final routeState = RouteStateScope.of(context);
    final pathTemplate = routeState.route.pathTemplate;

    Book? selectedBook;
    if (pathTemplate == '/book/:bookId') {
      selectedBook = libraryInstance.allBooks.firstWhereOrNull(
          (b) => b.id.toString() == routeState.route.parameters['bookId']);
    }

    Author? selectedAuthor;
    if (pathTemplate == '/author/:authorId') {
      selectedAuthor = libraryInstance.allAuthors.firstWhereOrNull(
          (b) => b.id.toString() == routeState.route.parameters['authorId']);
    }

    bool createBook = false;
    if (pathTemplate == '/createbook')
    {
      createBook = true;
    }

    bool createAuthor = false;
    if (pathTemplate == '/createauthor')
    {
      createAuthor = true;
    }    

    return Navigator(
      key: widget.navigatorKey,
      onPopPage: (route, dynamic result) {
        // When a page that is stacked on top of the scaffold is popped, display
        // the /books or /authors tab in BookstoreScaffold.
        if (route.settings is Page &&
            (route.settings as Page).key == _bookDetailsKey) {
          routeState.go('/books');
        }

        if (route.settings is Page &&
            (route.settings as Page).key == _authorDetailsKey) {
          routeState.go('/authors');
        }

        if (route.settings is Page &&
            (route.settings as Page).key == _bookCreateKey) {
          routeState.go('/books');
        }  

        if (route.settings is Page &&
            (route.settings as Page).key == _authorCreateKey) {
          routeState.go('/authors');
        }              

        return route.didPop(result);
      },
      pages: [
          // Display the app
          FadeTransitionPage<void>(
            key: _scaffoldKey,
            child: const BookstoreScaffold(),
          ),
          // Add an additional page to the stack if the user is viewing a book
          // or an author
          if (selectedBook != null)
            MaterialPage<void>(
              key: _bookDetailsKey,
              child: BookDetailsScreen(
                book: selectedBook,
              ),
            )
          else if (selectedAuthor != null)
            MaterialPage<void>(
              key: _authorDetailsKey,
              child: AuthorDetailsScreen(
                author: selectedAuthor,
              ),
            )
          else if (createBook)
            MaterialPage<void>(
              key: _bookCreateKey,
              child: BookCreateScreen(),
            )
          else if (createAuthor)
            MaterialPage<void>(
              key: _authorCreateKey,
              child: AuthorCreateScreen(),
            ),                        
      ],
    );
  }
}
