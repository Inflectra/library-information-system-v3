// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:flutter/material.dart';

import '../data.dart';

class BookList extends StatelessWidget {
  final List<Book> books;
  final ValueChanged<Book>? onTap;

  const BookList({
    required this.books,
    this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final style = theme.textTheme.labelSmall!.copyWith(
      color: Colors.red,
    );  

    return ListView.builder(
        itemCount: books.length,
        itemBuilder: (context, index) => ListTile(
          title: Text(
            books[index].name,
          ),
          subtitle: Text(
            books[index].author.name,
          ),
          trailing: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                books[index].genre.name,
              ),
              if (books[index].outOfPrint) Text(
                style: style,
                "Out of print",
              ),              
            ],
          ),          
          onTap: onTap != null ? () => onTap!(books[index]) : null,
        ),
      );
  }
}
