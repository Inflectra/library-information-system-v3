using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LisApp.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.Messaging;
using LisApp.Properties;
using CommunityToolkit.Mvvm.Messaging.Messages;

namespace LisApp.Services;

public class DataErrorMessage : ValueChangedMessage<Exception>
{
    public DataErrorMessage(Exception err) : base(err)
    {
    }
}

[ObservableRecipient]
public partial class DataService: ObservableObject
{
    private readonly HttpClient client = new HttpClient();

    [ObservableProperty]
    [NotifyPropertyChangedRecipients]
    private bool _isLoggedIn = false;

    [ObservableProperty]
    [NotifyPropertyChangedRecipients]
    private bool _isInProgress = false;

    public ObservableCollection<Book> Books { get; }
    public ObservableCollection<Author> Authors { get; }
    public ObservableCollection<Genre> Genres { get; }


    public User User { get; set; }

    public DataService()
    {
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
            );

        this.Messenger = WeakReferenceMessenger.Default;
    }

    private void LoadList<T>(ObservableCollection<T> collection, IEnumerable<T> items)
    {
        foreach (var item in items) { collection.Add(item); }
    }

    private async Task Authorize(string url, string clientId, string clientPassword)
    {
        client.BaseAddress = new Uri(url);

        var authenticationString = $"{clientId}:{clientPassword}";
        var base64EncodedAuthenticationString = Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(authenticationString));

        var requestMessage = new HttpRequestMessage(HttpMethod.Get, "users/login");
        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

        //make the request
        var response = await client.SendAsync(requestMessage);
        response.EnsureSuccessStatusCode();
        string responseBody = await response.Content.ReadAsStringAsync();
        var user = JsonConvert.DeserializeObject<User>(responseBody);
        if (user != null)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user.Token);
            await LoadData();
            IsLoggedIn = true;
        } else
        {
            Disconnect();
        }
    }

    private void Disconnect()
    {
        Books.Clear();
        Authors.Clear();
        Genres.Clear();
        User = null;
        IsLoggedIn = false;
    }

    private Task LoadData()
    {
        return Task.WhenAll(
            LoadBooks(),
            LoadAuthors(),
            LoadGenres()
        );
    }

    private async Task LoadBooks()
    {
        var responseBody = await client.GetStringAsync("books");
     
        var books = JsonConvert.DeserializeObject<List<Book>>(responseBody);
        LoadList(Books,books);
    }
    private async Task LoadAuthors()
    {
        var responseBody = await client.GetStringAsync("authors");

        var authors = JsonConvert.DeserializeObject<List<Author>>(responseBody);
        LoadList(Authors, authors);
    }
    private async Task LoadGenres()
    {
        var responseBody = await client.GetStringAsync("genres");

        var genres = JsonConvert.DeserializeObject<List<Genre>>(responseBody);
        LoadList(Genres, genres);
    }


    public async Task Login()
    {
        try
        {
            IsInProgress = true;
            await Authorize(Settings.Default.Url, Settings.Default.User, Settings.Default.Password);
            IsInProgress = false;
        } catch(Exception ex)
        {
            Console.WriteLine("Error" + ex);
            Messenger.Send(new DataErrorMessage(ex));
        }
    }

}
