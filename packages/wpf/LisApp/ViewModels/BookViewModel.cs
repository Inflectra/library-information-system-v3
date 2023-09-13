using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LisApp.Models;
using LisApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LisApp.ViewModels;

public partial class BookViewModel : ViewModelBase
{
    [ObservableProperty]
    string _message = "Book";

    [ObservableProperty]
    private Book book;

    [ObservableProperty]
    private bool isEditEnabled;

    [ObservableProperty]
    private string? authorName;

    [ObservableProperty]
    private string? genreName;

    private readonly DataService dataService;
    private readonly INavigationService navigation;

    public BookViewModel(DataService dataService, INavigationService _navigation)
    {
        this.dataService = dataService;
        this.navigation = _navigation;
    }

    [RelayCommand]
    public void Loaded()
    {
        this.Book = dataService.Book;
        this.IsEditEnabled = dataService.IsEdit;

        GenreName = dataService.Genres.FirstOrDefault(g => g.Id == this.Book.Genre)?.Name;
        AuthorName = dataService.Authors.FirstOrDefault(a => a.Id== this.Book.Author)?.Name;


    }

    [RelayCommand]
    public void Back()
    {
        navigation.NavigateTo<BookListViewModel>();
    }

    [RelayCommand]
    public void Edit()
    {
        navigation.NavigateTo<BookEditViewModel>();
    }

    [RelayCommand]
    public async void Delete()
    {
        await dataService.DeleteBook(this.Book);
        if(dataService.Book==null)
        {
            navigation.NavigateTo<BookListViewModel>();
        }
    }

}
