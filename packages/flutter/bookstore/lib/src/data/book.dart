// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'author.dart';
import 'genre.dart';

class Book {
  final int id;
  final String name;
  final Author author;
  final Genre genre;
  final String dateAdded;
  final bool outOfPrint;

  Book(this.id, this.name, this.author, this.genre, this.dateAdded, this.outOfPrint);
}
