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
using System.Net.Http.Json;
using System.Text.Json;
using Newtonsoft.Json.Serialization;
using ControlzEx.Standard;

namespace LisApp.Services;

public class DataErrorMessage : ValueChangedMessage<Exception>
{
    public DataErrorMessage(Exception err) : base(err)
    {
    }
}

public class JsonErrorMessage
{
    public string ErrorMessage { get; set; }

    public static bool TryParse(string content, out JsonErrorMessage result)
    {
        bool success = true;
        var settings = new JsonSerializerSettings
        {
            Error = (sender, args) => { success = false; args.ErrorContext.Handled = true; },
            MissingMemberHandling = MissingMemberHandling.Error
        };
        result = JsonConvert.DeserializeObject<JsonErrorMessage>(content, settings);
        return success;
    }
}

[ObservableRecipient]
public partial class DataService: ObservableObject
{
    private HttpClient client;
    private readonly JsonSerializerOptions jso = new JsonSerializerOptions()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };


    [ObservableProperty]
    [NotifyPropertyChangedRecipients]
    private bool _isLoggedIn = false;

    [ObservableProperty]
    [NotifyPropertyChangedRecipients]
    private bool _isInProgress = false;

    public ObservableCollection<Book> Books { get; } = new ObservableCollection<Book>();
    public ObservableCollection<Author> Authors { get; } = new ObservableCollection<Author>();
    public ObservableCollection<Genre> Genres { get; } = new ObservableCollection<Genre>();


    public User User { get; set; }

    public Book Book { get; set; }

    public Author Author { get; set; }
    public bool IsEdit { get => User?.Permission == Permissions.Edit || User?.Permission == Permissions.Admin; }
    public bool IsAdmin { get => User?.Permission == Permissions.Admin; }

    public DataService()
    {
        this.Messenger = WeakReferenceMessenger.Default;
    }

    private void LoadList<T>(ObservableCollection<T> collection, IEnumerable<T> items)
    {
        collection.Clear();
        foreach (var item in items) { collection.Add(item); }
    }

    private async Task Authorize(string url, string clientId, string clientPassword)
    {
        client = new HttpClient();
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
            );

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
            this.User = user;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user.Token);
            await LoadData();
            IsLoggedIn = true;
        } else
        {
            Disconnect();
        }
    }

    public void Disconnect()
    {
        Books.Clear();
        Authors.Clear();
        Genres.Clear();
        User = null;
        Book = null;
        Author = null;
        IsLoggedIn = false;
    }

    public Task LoadData()
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
            Messenger.Send(new DataErrorMessage(ex));
        }
    }

    #region Books
    private async Task SaveBookImpl(Book book)
    {
        HttpResponseMessage resp = null;
        if (book.Id == 0)
        {
            // Creating
            resp = await client.PostAsJsonAsync("books", book, jso);
        }
        else
        {
            // Updating
            resp = await client.PutAsJsonAsync("books", book, jso);

        }
        if (resp != null)
        {
            string content = await resp.Content.ReadAsStringAsync();
            if (resp.IsSuccessStatusCode)
            {
                book = JsonConvert.DeserializeObject<Book>(content);
                await LoadBooks();
                this.Book = this.Books.FirstOrDefault(b => b.Id == book.Id);
            } else
            {
                throw new Exception(resp.ReasonPhrase+"\n"+content);
            }
        } else
        {
            throw new Exception("No Response");
        }
    }

    public async Task<bool> SaveBook(Book book)
    {
        try
        {
            IsInProgress = true;
            await SaveBookImpl(book);
            IsInProgress = false;
            return true;
        }
        catch (Exception ex)
        {
            Messenger.Send(new DataErrorMessage(ex));
            return false;
        }
    }

    private async Task DeleteBookImpl(int id)
    {
        HttpResponseMessage resp = null;
        // Creating
        resp = await client.DeleteAsync($"books/{id}");

        if (resp != null)
        {
            string content = await resp.Content.ReadAsStringAsync();
            if (resp.IsSuccessStatusCode)
            {
                await LoadBooks();
                this.Book = null;
            }
            else
            {
                throw new Exception(resp.ReasonPhrase + "\n" + content);
            }
        }
        else
        {
            throw new Exception("No Response");
        }
    }

    public async Task DeleteBook(Book book)
    {
        try
        {
            IsInProgress = true;
            await DeleteBookImpl(book.Id);
            IsInProgress = false;
        }
        catch (Exception ex)
        {
            Messenger.Send(new DataErrorMessage(ex));
        }
    }

    #endregion Books

    #region Authors
    private async Task SaveAuthorImpl(Author author)
    {
        HttpResponseMessage resp = null;
        if (author.Id == 0)
        {
            // Creating
            resp = await client.PostAsJsonAsync("authors", author, jso);
        }
        else
        {
            // Updating
            resp = await client.PutAsJsonAsync("authors", author, jso);

        }
        if (resp != null)
        {
            string content = await resp.Content.ReadAsStringAsync();
            if (resp.IsSuccessStatusCode)
            {
                author = JsonConvert.DeserializeObject<Author>(content);
                await LoadAuthors();
                this.Author = this.Authors.FirstOrDefault(b => b.Id == author.Id);
            }
            else
            {
                if(JsonErrorMessage.TryParse(content, out JsonErrorMessage jem))
                {
                    throw new Exception(jem.ErrorMessage);
                }
                throw new Exception(resp.ReasonPhrase + "\n" + content);
            }
        }
        else
        {
            throw new Exception("No Response");
        }
    }

    public async Task<bool> SaveAuthor(Author author)
    {
        try
        {
            IsInProgress = true;
            await SaveAuthorImpl(author);
            IsInProgress = false;
            return true;
        }
        catch (Exception ex)
        {
            Messenger.Send(new DataErrorMessage(ex));
            return false;
        }
    }

    private async Task DeleteAuthorImpl(int id)
    {
        HttpResponseMessage resp = null;
        // Creating
        resp = await client.DeleteAsync($"authors/{id}");

        if (resp != null)
        {
            string content = await resp.Content.ReadAsStringAsync();
            if (resp.IsSuccessStatusCode)
            {
                await LoadAuthors();
                this.Author = null;
            }
            else
            {
                if (JsonErrorMessage.TryParse(content, out JsonErrorMessage jem))
                {
                    throw new Exception(jem.ErrorMessage);
                }
                throw new Exception(resp.ReasonPhrase + "\n" + content);
            }
        }
        else
        {
            throw new Exception("No Response");
        }
    }

    public async Task DeleteAuthor(Author author)
    {
        try
        {
            IsInProgress = true;
            await DeleteAuthorImpl(author.Id);
            IsInProgress = false;
        }
        catch (Exception ex)
        {
            Messenger.Send(new DataErrorMessage(ex));
        }
    }

    #endregion Authors


}
