// Copyright 2021, the Flutter project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'dart:convert';

import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'author.dart';
import 'book.dart';
import 'genre.dart';
import '../services/backend_service.dart';

final libraryInstance = Library()
  ..addGenre(genreId: 1, name: "Fiction")
  ..addAuthor(authorId: 1, name: "Charles Dickens", age: 105)
  ..addBook(bookId: 1, name: 'Oliver Twist', authorId: 1, genreId: 1, dateAdded: "4/11/2016 10:24:49 PM", outOfPrint: false);

class Library {

  static SharedPreferences? localStorage;
  static Future init() async {
    localStorage = await SharedPreferences.getInstance();
  }

  final List<Book> allBooks = [];
  final List<Author> allAuthors = [];
  final List<Genre> allGenres = [];

  final getIt = GetIt.instance;
  BackendService backendService = GetIt.instance.get<BackendService>();

  Future<dynamic> loadData()
  {
    allBooks.clear();
    allGenres.clear();
    allAuthors.clear();

    return backendService.getDataFromBackend("genres").then((genres) {
      readGenres(genres);
      return backendService.getDataFromBackend("authors").then((authors) {
        readAuthors(authors);
        return backendService.getDataFromBackend("books").then((books) {
          readBooks(books);
          return books;
        });
      });
    });
  }

  void readGenres(dynamic genres)
  {
    for(var genre in genres)
    {
      addGenre(
        genreId: genre["id"],
        name: genre["name"]
      );
    }
  }

  void readAuthors(dynamic authors)
  {
    for(var author in authors)
    {
      addAuthor(
        authorId: author["id"],
        name: author["name"],
        age: author["age"]
      );
    }
  }

  void readBooks(dynamic books)
  {
    for(var book in books)
    {
      addBook(
        bookId: book["id"],
        name: book["name"],
        authorId: book["author"],
        genreId: book["genre"],
        dateAdded: book["dateAdded"],
        outOfPrint: book["outOfPrint"]
      );
    }
  }

  void addGenre({
    required int genreId,
    required String name
  })
  {
      var genre = Genre(genreId, name);
      allGenres.add(genre);
  }  

  void addAuthor({
    required int authorId,
    required String name,
    required int age
  })
  {
      var author = Author(authorId, name, age);
      allAuthors.add(author);
  }

  void addBook({
    required int bookId,
    required String name,
    required int authorId,
    required int genreId,
    required String dateAdded,
    required bool outOfPrint
  }) {
    var author = allAuthors.firstWhere((author) => author.id == authorId);
    var genre = allGenres.firstWhere((genre) => genre.id == genreId);
    var book = Book(bookId, name, author, genre, dateAdded, outOfPrint);
    author.books.add(book);
    allBooks.add(book);
  }

  Future deleteBook(Book book) async {
    print("Deleting the book: ${book.name}");
    return backendService.getDataFromBackend('books/${book.id}', "delete").then((result) => Future.value(true));
  }

  Future updateBook(Book book, {String? newName, int? newAuthorId, int? newGenreId}) async {
    print("Updating the book: ${book.id}");
    print("New name: $newName");
    print("New author id: $newAuthorId");
    print("New genre id: $newGenreId");

    var newBook = {
      "id": book.id,
      "name": newName,
      "author": allAuthors.firstWhere((author) => author.id == newAuthorId).id,
      "genre": allGenres.firstWhere((genre) => genre.id == newGenreId).id,
      "dateAdded": book.dateAdded,
      "outOfPrint": book.outOfPrint
    };

    return backendService.getDataFromBackend('books', "put", jsonEncode(newBook)).then((result) => Future.value(true));
  }

  Future updateAuthor(Author author, {String? newName, int? newAge}) async {
    print("Updating the author: ${author.id}");
    print("New name: $newName");
    print("New age: $newAge");

    var newAuthor = {
      "id": author.id,
      "name": newName,
      "age": newAge
    };

    return backendService.getDataFromBackend('authors', "put", jsonEncode(newAuthor)).then((result) => Future.value(true));
  }  

  Future createBook(String name, int authorId, int genreId) async {
    print("Creating the book:");
    print("Name: $name");
    print("Author id: $authorId");
    print("Genre id: $genreId");

    var book = {
      "name": name,
      "author": allAuthors.firstWhere((author) => author.id == authorId).id,
      "genre": allGenres.firstWhere((genre) => genre.id == genreId).id,
      "dateAdded": DateTime.now().toIso8601String(),
      "outOfPrint": false
    };

    return backendService.getDataFromBackend('books', "post", jsonEncode(book)).then((result) => Future.value(true));
  }

  Future createAuthor(String name, int age) async {
    print("Creating the author:");
    print("Name: $name");
    print("Age: $age");

    var author = {
      "name": name,
      "age": age
    };

    return backendService.getDataFromBackend('authors', "post", jsonEncode(author)).then((result) => Future.value(true));
  }  

}
