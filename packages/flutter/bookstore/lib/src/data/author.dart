import 'book.dart';

class Author {
  final int id;
  final String name;
  final int age;
 
  final List<Book> books = [];  

  Author(this.id, this.name, this.age);
}
