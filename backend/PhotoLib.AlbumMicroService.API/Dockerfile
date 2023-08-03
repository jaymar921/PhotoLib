#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["PhotoLib.SystemCore.Libraries/PhotoLib.SystemCore.Libraries.csproj", "PhotoLib.SystemCore.Libraries/"]
COPY ["PhotoLib.AlbumMicroService.API/PhotoLib.AlbumMicroService.API.csproj", "PhotoLib.AlbumMicroService.API/"]
RUN dotnet restore "PhotoLib.AlbumMicroService.API/PhotoLib.AlbumMicroService.API.csproj"
COPY . .
WORKDIR "/src/PhotoLib.AlbumMicroService.API"
RUN dotnet build "PhotoLib.AlbumMicroService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PhotoLib.AlbumMicroService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PhotoLib.AlbumMicroService.API.dll"]