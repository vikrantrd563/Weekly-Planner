# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["WeeklyPlanner.API/WeeklyPlanner.API.csproj", "WeeklyPlanner.API/"]
COPY ["WeeklyPlanner.Application/WeeklyPlanner.Application.csproj", "WeeklyPlanner.Application/"]
COPY ["WeeklyPlanner.Infrastructure/WeeklyPlanner.Infrastructure.csproj", "WeeklyPlanner.Infrastructure/"]
RUN dotnet restore "WeeklyPlanner.API/WeeklyPlanner.API.csproj"
COPY . .
WORKDIR "/src/WeeklyPlanner.API"
RUN dotnet build "WeeklyPlanner.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "WeeklyPlanner.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeeklyPlanner.API.dll"]