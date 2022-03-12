defmodule Api.Router do
  use Api, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :token_validation do
    plug Api.Plugs.Authenticate
  end

  scope "/api", Api do
    pipe_through :api
    get "/authorize", AuthorizationController, :authorize
    get "/authenticate", AuthorizationController, :authenticate

    pipe_through :token_validation

    scope "/songs" do
      get "/me", SongController, :get_saved_songs
      get "/me/save", SongController, :save_saved_songs
    end

    scope "/playlists" do
      get "/me", PlaylistController, :get_current_user_playlists
      get "/me/save", PlaylistController, :save_current_user_playlists
    end

    scope "/users" do
      get "/me", UserController, :get_current_user
      get "/me/save", UserController, :save_current_user
    end

    scope "/albums" do
      get "/me", AlbumController, :get_saved_albums
      get "/me/save", AlbumController, :save_saved_albums
    end

    scope "/artists" do
      get "/me", ArtistController, :get_followed_artists
      get "/me/save", ArtistController, :save_followed_artists
    end
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: Api.Telemetry
    end
  end
end