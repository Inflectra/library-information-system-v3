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

public partial class AuthorViewModel : ViewModelBase
{

    [ObservableProperty]
    string _message = "Author";

    [ObservableProperty]
    private Author? author;

    [ObservableProperty]
    private bool isEditEnabled;

    private readonly DataService dataService;
    private readonly INavigationService navigation;

    public AuthorViewModel(DataService dataService, INavigationService _navigation)
    {
        this.dataService = dataService;
        this.navigation = _navigation;
    }

    [RelayCommand]
    public void Loaded()
    {
        this.Author = dataService.Author;
        this.IsEditEnabled = dataService.IsEdit;
    }

    [RelayCommand]
    public void Back()
    {
        navigation.NavigateTo<AuthorListViewModel>();
    }

    [RelayCommand]
    public void Edit()
    {
        navigation.NavigateTo<AuthorEditViewModel>();
    }

    [RelayCommand]
    public async Task Delete()
    {
        await dataService.DeleteAuthor(this.Author);
        if (dataService.Author == null)
        {
            navigation.NavigateTo<AuthorListViewModel>();
        }
    }
}
