1. Publish the angular application in the 'wwwroot' folder of the dotnet api folder

2. Add the content folder to the api solution file with folowing property. This is needed in order to take this folder into account when        publishing.
    - `<Content Include="Content\**" CopyToPublishDirectory="PreserveNewest" />`
    - `dotnet restore`

3. In the 'StoreContextSeed' file we seed data from local .json files in order to show products, brands, types,... This is not going to work when migrating to production. We need to make changements in the infratructure.sln file.
    - `<None Include="Data\SeedData\**" CopyToOutputDirectory="PreserveNewest" />`
    - `dotnet restore`

3. Publish the dotnet application, use following command:
    - `dotnet publish -c Release -o publish .\skinet.sln`