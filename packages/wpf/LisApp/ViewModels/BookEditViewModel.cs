using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CommunityToolkit.Mvvm.Messaging;
using LisApp.Models;
using LisApp.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LisApp.ViewModels;

[ObservableRecipient]
public partial class BookEditViewModel : ViewModelBase
{
    [ObservableProperty]
    string message = "Create Book";

    [ObservableProperty]
    string mainAction = "Create";

    [ObservableProperty]
    string mainActionIcon = "Plus";

    [ObservableProperty]
    private Book book;

    public ObservableCollection<Author> Authors => dataService.Authors;
    public ObservableCollection<Genre> Genres => dataService.Genres;

    private readonly DataService dataService;
    private readonly INavigationService navigation;

    public BookEditViewModel(DataService dataService, INavigationService _navigation)
    {
        this.dataService = dataService;
        this.navigation = _navigation;
        this.Messenger = WeakReferenceMessenger.Default;
    }

    [RelayCommand]
    public void Loaded()
    {
        if (dataService.Book == null)
        {
            dataService.Book = new Book()
            {
                Id = 0,
                DateAdded = DateTime.Now,
            };
            this.Message = "Create New Book";
            this.MainAction = "Create";
            this.MainActionIcon = "Plus";
        }
        else
        {
            this.Message = "Edit Book";
            this.MainAction = "Save";
            this.MainActionIcon = "ContentSave";
        }

        this.Book = dataService.Book;
    }


    [RelayCommand]
    public async void Back()
    {
        await dataService.LoadData();
        navigation.NavigateTo<BookListViewModel>();
    }

    [RelayCommand]
    public async void Save()
    {
        try
        {
            if(await dataService.SaveBook(book))
            {
                navigation.NavigateTo<BookListViewModel>();
            }
        } catch (Exception ex)
        {

            Messenger.Send(new DataErrorMessage(ex));
        }
    }


}
