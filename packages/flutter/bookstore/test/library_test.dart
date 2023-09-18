// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:bookstore/src/data/library.dart';
import 'package:test/test.dart';

void main() {
  group('Library', () {
    test('addBook', () {
      final library = Library()
      ..addGenre(genreId: 1, name: "Fiction")
      ..addAuthor(authorId: 1, name: "Charles Dickens", age: 105)
      ..addBook(bookId: 1, name: 'Oliver Twist', authorId: 1, genreId: 1, dateAdded: "4/11/2016 10:24:49 PM", outOfPrint: false);

      expect(library.allGenres.length, 1);
      expect(library.allAuthors.length, 1);
      expect(library.allBooks.length, 1);
      expect(library.allBooks.first.author.name, startsWith('Charles'));
    });
  });
}
