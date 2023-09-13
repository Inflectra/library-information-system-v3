using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LisApp.Models;
using LisApp.Services;
using LisApp.Views;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Reflection.Metadata.BlobBuilder;
using System.Windows.Data;

namespace LisApp.ViewModels;

public partial class AuthorListViewModel : ViewModelBase
{
    private readonly DataService dataService;
    private readonly INavigationService navigation;

    [ObservableProperty]
    string _message = "Authors";

    private string _searchKeyword;
    public string? SearchKeyword
    {
        get => _searchKeyword;
        set
        {
            if (SetProperty(ref _searchKeyword, value))
            {
                AuthorsView.Filter = AuthorFilter;
                AuthorsView.Refresh();
            }
        }
    }
    private bool AuthorFilter(object obj) => obj is Author author&&
            (string.IsNullOrEmpty(SearchKeyword) || author.Name.Contains(SearchKeyword, StringComparison.InvariantCultureIgnoreCase));


    public ObservableCollection<Author> Authors => dataService.Authors;

    public ICollectionView AuthorsView => CollectionViewSource.GetDefaultView(Authors);

    [ObservableProperty]
    private bool isEditEnabled;

    public AuthorListViewModel(DataService _dataService, INavigationService _navigation)
    {
        dataService = _dataService;
        navigation = _navigation;
    }

    [RelayCommand]
    public void Loaded()
    {
        this.IsEditEnabled = dataService.IsEdit;

        if (dataService.Author != null)
        {
            if (AuthorsView.Contains(dataService.Author))
            {
                AuthorsView.MoveCurrentTo(dataService.Author);
            }
        }

    }

    [RelayCommand]
    public void CreateAuthor()
    {
        dataService.Author = null;
        navigation.NavigateTo<AuthorEditViewModel>();
    }

    [RelayCommand]
    public void ShowAuthor(Author author)
    {
        dataService.Author = author;
        navigation.NavigateTo<AuthorViewModel>();
    }

    [RelayCommand]
    public void EditAuthor(Author author)
    {
        dataService.Author = author;
        navigation.NavigateTo<AuthorEditViewModel>();
    }

    [RelayCommand]
    public void DoubleClick(Author author)
    {
        ShowAuthor(author);
    }

}
