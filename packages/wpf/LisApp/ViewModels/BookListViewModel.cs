using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LisApp.Models;
using LisApp.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace LisApp.ViewModels;

public partial class BookListViewModel : ViewModelBase
{
    private readonly DataService dataService;
    private readonly INavigationService navigation;
    [ObservableProperty]
    string _message = "Books";

    private string _searchKeyword;
    public string? SearchKeyword
    {
        get => _searchKeyword;
        set
        {
            if (SetProperty(ref _searchKeyword, value))
            {
                BooksView.Filter = BookFilter;
                BooksView.Refresh();
            }
        }
    }
    private bool BookFilter(object obj) => obj is Book book &&
            (string.IsNullOrEmpty(SearchKeyword) || book.Name.Contains(SearchKeyword,StringComparison.InvariantCultureIgnoreCase));


    public ObservableCollection<Book> Books => dataService.Books;


    public ObservableCollection<Author> Authors =>dataService.Authors;

    public ObservableCollection<Genre> Genres =>dataService.Genres;

    public ICollectionView BooksView => CollectionViewSource.GetDefaultView(Books);

    [ObservableProperty]
    private bool isEditEnabled;

    public BookListViewModel(DataService _dataService, INavigationService _navigation)
    {
        dataService = _dataService;
        navigation = _navigation;
    }

    [RelayCommand]
    public void Loaded()
    {
        this.IsEditEnabled = dataService.IsEdit;

        if (dataService.Book!=null)
        {
            if(BooksView.Contains(dataService.Book))
            {
                BooksView.MoveCurrentTo(dataService.Book);
            }
        }

    }

    [RelayCommand]
    public void CreateBook()
    {
        Console.WriteLine("CreateBook");
        dataService.Book = null;
        navigation.NavigateTo<BookEditViewModel>();
    }

    [RelayCommand]
    public void ShowBook(Book book)
    {
        dataService.Book = book;
        navigation.NavigateTo<BookViewModel>();
    }

    [RelayCommand]
    public void EditBook(Book book)
    {
        dataService.Book = book;
        navigation.NavigateTo<BookEditViewModel>();
    }

    [RelayCommand]
    public void DoubleClick(Book book)
    {
        ShowBook(book);
    }

}
