---
sidebar_position: 3
---

# Engine design document

This is a rough sketch of the final engine. Treat this as some type of "this is how a 1.0 will look". The current iteration of the engine does not match this, but features will be indicated with symbols: ✔🛠❌.

Entries marked with ✔ are mostly or fully complete (are used widely throughout the engine and plugins), ❌ means not started yet, and 🛠 means this area is a work in progress. These markers will be updated periodically.

## Overall architecture

There are generally 3 layers:
* Application ✔ - This is game/application logic, leveraging the engine's subsystems.
* Application framework 🛠 - Takes care of launching all the engine's subsystems needed for a particular application type. There should be a couple templates to minimise bloat:
	* CLI tool - Uses a few basic subsystems (logging, plugin system, virtual filesystem, asset system).
	* Application - Utilises all engine subsystems (e.g. rendering and audio on top of prior ones) to run games or desktop GUI tools.
	* Game - Like *Application*, but it launches a moddable game, so it initialises a little differently.
* Launcher ✔ - A concrete executable that launches the application framework with one of the aforementioned templates.

Modules are organised into a few categories:
* Core modules
* Addon modules
* System modules
* Plugins

## Core libraries

Most of these libraries are designed to be engine-agnostic, meaning you can use these outside of Elegy.

- Elegy.Common - Utility library ✔
- Elegy.Framework - Engine core, handles engine configuration etc. 🛠
	- CLI tool template ❌
	- Application template ❌
	- Game template ✔
- Elegy.ECS - Eventful entity component system library 🛠
- Elegy.Scripting - C# scripting library ❌
- Elegy.RenderBackend - Veldrid/Vulkan utilities ✔

## Addon libraries

These are optional libraries you can use within an Elegy application. Unlike plugins that are loaded dynamically at runtime, addons are used by developers at design time.

- Elegy.Avalonia 🛠
	- Integration with Avalonia for building desktop GUI apps ❌
	- In-game Avalonia UI 🛠
- Elegy.VirtualReality ❌
	- VR support powered by OpenXR
	- Full body tracking support via SteamVR

## System modules

These libraries implement engine subsystems, but are mostly independent (❌) of each other.

- Elegy.AssetSystem ✔
	- Quake 3-style materials ✔
	- Data-driven shaders ✔
	- Model asset loading (plugin-based) ✔
	- Texture asset loading (plugin-based) ✔
	- Level loading (plugin-based) ✔
- Elegy.AudioSystem (plugin-based) ❌
	- Sound sources, listener
	- Sound FX
	- Geometric acoustics
- Elegy.CommandSystem 🛠
	- *Note: currently called Elegy.ConsoleSystem*
	- Console frontends ✔
		- External developer console 🛠
	- Console commands ✔
	- CVars ❌
- Elegy.FileSystem
	- Mounting game/mod paths ✔
	- Mounting addon paths 🛠
- Elegy.Input
	- Keyboard, mouse input ✔
	- Gamepad & joysticks 🛠
- Elegy.LogSystem
	- *Note: currently part of Elegy.ConsoleSystem*
	- Logging, warnings, errors ✔
	- Tagged logging ✔
	- File logger ❌
- Elegy.NetworkSystem ❌
	- Utility layer on top of ENet or similar
- Elegy.PlatformSystem
	- Windowing (injected) ✔
	- Fundamental engine configuration, e.g. headless mode ✔
- Elegy.PluginSystem
	- Flexible plugin system ✔
	- Plugin dependencies 🛠
	- Plugin reloading 🛠
	- Plugin versioning 🛠
- Elegy.RenderSystem 🛠
	- Slang-based shader system 🛠
	- Renderable objects:
		- Mesh entities ✔
		- Batches ❌
		- Volumes ❌
		- Lights ❌
	- Views & rendering into windows ✔
	- Debug rendering 🛠
	- Render styles (plugin-based) 🛠
		- Style99 - Lightmapped 90s style shading 🛠
		- StyleModern - Physically-based shading, POM, reflections etc. ❌

Legend:
- Plugin-based: implemented in a plugin, engine just provides API
- Injected: implemented externally (e.g. in a launcher), engine just sees API

## Game SDK

- AI ❌
	- Goal-oriented action planning
	- Use Recast/DotRecast
- Animation ❌
	- Animation playback and management
	- Animation blending
	- Animation channels
	- Inverse kinematics
- Client 🛠
	- Client controllers (handle input and interaction with the game world) ✔
	- Keybind system ❌
	- View bobbing and viewport management ❌
- Entity system ✔
	- Reactive ECS ✔
	- Source-style IO ✔
	- Scripting ❌
- Game sessions ✔
	- Menu state, loading state, playing state, paused state etc. ✔
	- Linking a client into the game ✔
- Gamemodes ❌
	- Campaign, deathmatch, team deathmatch, co-op etc.
- Netcode 🛠
	- Mainly intended for LAN co-op
	- Quake-style client-server with prediction and rollback ❌
	- Singleplayer bridge ✔
- Particles ❌
- Physics 🛠
	- Rigid bodies 🛠
	- Constraints ❌
- Save-load system ❌
- UI ❌
	- ImGui for quick'n'easy stuff
	- Custom game UI system for everything else

## Tools

Every engine needs good tooling. Elegy would come with these:
- Elegy.Librarian - Plugin-based game data editor. Used to edit e.g. vehicle configs, NPC profiles, difficulty settings and so on. Editing tools provided by plugins. ❌
- Elegy.MagicWand - Manages projects and Elegy Engine installations. ❌
- Elegy.MapCompiler - EMC for short, it compiles levels. 🛠
	- Utilises the plugin system to bake game-specific or render-style-specific data. ❌
	- Usable with TrenchBroom. ✔
- Elegy.ModelEditor - Based on *Elegy.Librarian*, a tool for importing models, fixing them up and editing game-specific metadata. Or just viewing them. ❌
- Elegy.ShaderTool - Compiles Slang shaders and generates extra data for the render system. 🛠

A custom map editor may be a possibility, but that would be way after v1.0.

## Workflow and features
### Overall:
- Quake-style workflow.
- There’s an engine executable in the root folder, accompanied by game folders and an engine folder.
- The engine folder contains base engine assets, e.g. a “missing model” model, a “missing texture” texture and whatnot.
- Each game/mod folder contains a configuration file that describes it as well as its plugins and dependencies.

### Mapping:
- You’d use an external level editor like TrenchBroom, J.A.C.K. or NetRadiant-custom.
- You’d also use a map compiler, either as part of your level editor’s compile config, or through a console command.

### Modelling:
- You’d use a model editor like Blender.
- Export GLTF for basic props, import via custom tool for extra attributes for complex models.

### Texturing, sound design and other trivial asset types:
- Quite simply place your PNGs/WAVs/FLACs into a textures/sounds folder, it’s just there.

### UI:
- Declarative C# UI files sitting in a directory.

### Scripting:
- Naked C# scripts, S&box-style.
- Level scripts
- UI scripts
- NPC scripts?
- Weapon scripts?
- Vehicle scripts?
