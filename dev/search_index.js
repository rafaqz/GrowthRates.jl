var documenterSearchIndex = {"docs":
[{"location":"#GrowthMaps.jl","page":"Home","title":"GrowthMaps.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Modules = [GrowthMaps]\nOrder   = [:module, :type, :function, :macro]","category":"page"},{"location":"#GrowthMaps.GrowthMaps","page":"Home","title":"GrowthMaps.GrowthMaps","text":"GrowthMaps\n\n(Image: ) (Image: ) (Image: Build Status) (Image: codecov.io)\n\nGrowthMaps.jl produces gridded growth rates from gridded environmental data and process with growth and stress models, following the method outlined in Maino et al, \"Forecasting the potential distribution of the invasive vegetable leafminer using ‘top-down’ and ‘bottom-up’ models\" (in press). \n\nThey are intended to be (and already practically used as) a replacement for CLIMEX and  similar tools. Different from CLIMEX is that results arrays have units of growth/time.  Another useful property of these models is that growth rate layers can be added and  combined arbitrarily.\n\nA primary use-case for GrowthMaps layers is in for calculating growth-rates for  (Image: Dispersal.jl).\n\n(Image: GrowthMaps output)\n\nFor data input, this package leverages GeoData.jl to import stacks of environmental data from many different sources, loaded lazily in sequence to minimise memory use. These can also be loaded and run on a GPU.\n\nExample\n\nusing GrowthMaps, GeoData, HDF5, CUDA, Unitful\n\n# Define a growth model\np = 3e-01\nΔH_A = 3e4cal/mol\nΔH_L = -1e5cal/mol\nΔH_H = 3e5cal/mol\nThalf_L = 2e2K\nThalf_H = 3e2K\nT_ref = K(25.0°C)\ngrowthmodel = SchoolfieldIntrinsicGrowth(p, ΔH_A, ΔH_L, Thalf_L, ΔH_H, Thalf_H, T_ref)\n\n# Wrap the model with a data layer with the key\n# to retreive the data from, and the Unitful.jl units.\ngrowth = Layer(:surface_temp, K, growthmodel)\n\nNow we will use GeoData.jl to load a series of SMAP files lazily,  and GrowthMaps.jl will load them to an Nvida GPU just in time for processing:\n\n\npath = \"your_SMAP_folder\"\n# Load 100s of HDF5 files lazyily with GeoData.jl\nseries = SMAPseries(path)\n# Set the timespan you want layers for\ntspan = DateTime(2016, 1):Month(1):DateTime(2016, 12)\n# Use and Nvidia GPU for computations\narraytype = CuArray\n\noutput = mapgrowth(growth;\n    series=aggseries,\n    tspan=tspan,\n    arraytype=arraytyps,\n)\n\n# Plot the first tii\noutput[Ti(1)] |> plot\n\nGrowthMaps.jl can run this growth model over thousands  of HDF5 files in minutes, on a regular desktop with a GPU, although a CPU alone is not too much slower.\n\nThe models can be chained together and run over multiple data layers simultaneously. \n\nSee the Examples section in the documentation to get started. You can also work through the  example.jmd in atom (with the language-weave plugin) or the notebook.\n\nLive Interfaces\n\nGrowthMaps provides interfaces for manually fitting models where automated fits are not appropriate.\n\nModel curves can be fitted to an AbstractRange of input data using manualfit:\n\n(Image: manualfit interface)\n\nObservations can be fitted to a map. Aggregated maps GeoSeries can be used to fit models in real-time.  See the examples for details.\n\n(Image: mapfit interface)\n\n\n\n\n\n","category":"module"},{"location":"#GrowthMaps.GrowthModel","page":"Home","title":"GrowthMaps.GrowthModel","text":"The intrinsic rate of population growth is the exponential growth rate of a population when growth is not limited by density dependent factors.\n\nMore formally, if the change in population size N with time t is expressed as fracdNdt = rN, then r is the intrinsic population growth rate (individuals per day per individual) which can be decomposed into per capita reproduction and mortality rate. The intrinsic growth rate parameter r depends strongly on temperature, with population growth inhibited at low and high temperatures (Haghani et al. 2006).\n\nThis can be described using a variety of non-linear functions, see SchoolfieldIntrinsicGrowth for an implementation.\n\n\n\n\n\n","category":"type"},{"location":"#GrowthMaps.Layer","page":"Home","title":"GrowthMaps.Layer","text":"Layer{K,U}(model::RateModel)\nLayer(key::Symbol, model::RateModel)\nLayer(key::Symbol, u::Union{Units,Quantity}, model::RateModel)\n\nLayers connect a model to a data source, providing the key to look up the layer in a GeoData.jl GeoStack, and specifying the scientific units of the layer, if it has units. Using units adds an extra degree of safety to your calculation, and allows for using data in different units with the same models.\n\n\n\n\n\n","category":"type"},{"location":"#GrowthMaps.LowerStress","page":"Home","title":"GrowthMaps.LowerStress","text":"LowerStress(key::Symbol, threshold, mortalityrate)\n\nA StressModel where stress occurs below a threshold at a specified mortalityrate for some environmental layer key.\n\nIndependent variables must be in the same units as\n\n\n\n\n\n","category":"type"},{"location":"#GrowthMaps.ModelWrapper","page":"Home","title":"GrowthMaps.ModelWrapper","text":"Passed to an optimiser to facilitate fitting any RateModel, without boilerplate or methods rewrites.\n\n\n\n\n\n","category":"type"},{"location":"#GrowthMaps.ModelWrapper-Tuple{Any,Any}","page":"Home","title":"GrowthMaps.ModelWrapper","text":"Update the model with passed in params, and run [rate] over the independent variables.\n\n\n\n\n\n","category":"method"},{"location":"#GrowthMaps.RateModel","page":"Home","title":"GrowthMaps.RateModel","text":"A RateModel conatains the parameters to calculate the contribution of a growth or stress factor to the overall population growth rate.\n\nA rate method corresponding to the model type must be defined specifying the formulation, and optionally a condition method to e.g. ignore data below thresholds.\n\n\n\n\n\n","category":"type"},{"location":"#GrowthMaps.SchoolfieldIntrinsicGrowth","page":"Home","title":"GrowthMaps.SchoolfieldIntrinsicGrowth","text":"SchoolfieldIntrinsicGrowth(p, ΔHA, ΔHL, ΔHH, ThalfL, ThalfH, Tref, R)\n\nA GrowthModel where the temperature response of positive growth rate is modelled following Schoolfield et al. 1981, \"Non-linear regression of biological temperature-dependent rate models base on absolute reaction-rate theory\".\n\nThe value of the specified data layer must be in Kelvin.\n\nArguments\n\np::P: growth rate at reference temperature T_ref\nΔH_A: enthalpy of activation of the reaction that is catalyzed by the enzyme, in cal/mol or J/mol.\nΔH_L: change in enthalpy associated with low temperature inactivation of the enzyme.\nΔH_H: change in enthalpy associated with high temperature inactivation of the enzyme.\nT_halfL: temperature (Unitful K) at which the enzyme is 1/2 active and 1/2 low temperature inactive.\nT_halfH: temperature (Unitful K) at which the enzyme is 1/2 active and 1/2 high temperature inactive.\nT_ref: Reference temperature in kelvin.\n\nThis can be parameterised from empirical data, (see Zhang et al. 2000; Haghani et al. 2006; Chien and Chang 2007) and non-linear least squares regression.\n\n\n\n\n\n","category":"type"},{"location":"#GrowthMaps.StressModel","page":"Home","title":"GrowthMaps.StressModel","text":"Extreme stressor mortality can be assumed to occur once an environmental variable s exceeds some threshold (e.g. critical thermal maximum), beyond which the mortality rate scales approximately linearly with the depth of the stressor (Enriquez and Colinet 2017).\n\nStressor induced mortality is incorporated in growth rates by quantifying the threshold parameter s_c beyond which stress associated mortality commences, and the mortalityrate parameter m_s which reflects the per-capita mortality per stress unit, per time (e.g. degrees beyond the stress threshold per day).\n\nWhen stressors are combined in a model, the mortality rate for each stressor s is incorporated as fracdNdt=(r_p-r_n)N where r_n = sumsf(s c_s)m_s and f(s c_s) is a function that provides the positive units by which s exceeds s_c.\n\nThis relies on the simplifying assumption that different stressors contribute additively to mortality rate, but conveniently allows the mortality response of stressors to be partitioned and calculated separately to the intrinsic growth rate, which aids parameterisation and modularity. More complicated stress responses are more likely to capture reality more completely, but the availability of data on detailed mortality responses to climatic stressors is often lacking.\n\nUpper and lower stresses may be in relation to any environmental variable, specied with the key parameter, that will use the data at that key in GeoStack for the current timestep.\n\n\n\n\n\n","category":"type"},{"location":"#GrowthMaps.UpperStress","page":"Home","title":"GrowthMaps.UpperStress","text":"UpperStress(key::Symbol, threshold, mortalityrate)\n\nA StressModel where stress occurs above a threshold at the specified mortalityrate, for some environmental layer key.\n\n\n\n\n\n","category":"type"},{"location":"#GrowthMaps.condition","page":"Home","title":"GrowthMaps.condition","text":"condition(m, x)\n\nSubseting the data before applying the rate method, given the model m and the environmental variable of value x. Returns a boolean. If not defined, defaults to true for all values.\n\n\n\n\n\n","category":"function"},{"location":"#GrowthMaps.fit!-Tuple{ModelWrapper,AbstractArray}","page":"Home","title":"GrowthMaps.fit!","text":"fit!(model::ModelWrapper, obs::AbstractArray)\n\nRun fit on the contained model, and write the updated model to the mutable modelwrapper.\n\n\n\n\n\n","category":"method"},{"location":"#GrowthMaps.fit-Tuple{Any,AbstractArray}","page":"Home","title":"GrowthMaps.fit","text":"fit(model, obs::AbstractArray)\n\nFit a model to data with least squares regression, using curve_fit from LsqFit.jl. The passed in model should be initialised with sensible defaults, these will be used as the initial parameters for the optimization.\n\nAny (nested) Real fields on the struct are flattened to a parameter vector using Flatten.jl. Fields can be marked to ignore using the @flattenable macro from FieldMetadata.jl.\n\nArguments\n\nmodel: Any constructed RateModel or a Tuple of RateModel.\nobs: Vector of observations, such as length 2 Tuples of Real. Leave units off.\n\nReturns\n\nAn updated model with fitted parameters.\n\n\n\n\n\n","category":"method"},{"location":"#GrowthMaps.manualfit!-Tuple{ModelWrapper,NamedTuple{var\"#s29\",var\"#s19\"} where var\"#s19\"<:Tuple{Vararg{AbstractArray{T,1} where T,N} where N} where var\"#s29\"}","page":"Home","title":"GrowthMaps.manualfit!","text":"manualfit!(wrapper::ModelWrapper, ranges::Array; obs=[],  kwargs...) =\n\nReturns the wrapper with the fitted model.\n\nobs: A Vector of (val, rate) tuples/vectors\ndata:\n\nExample\n\np = 3e-01\nΔH_A = 3e4cal/mol\nΔH_L = -1e5cal/mol\nΔH_H = 3e5cal/mol\nThalf_L = 2e2K\nThalf_H = 3e2K\nT_ref = K(25.0°C)\ngrowthmodel = SchoolfieldIntrinsicGrowth(p, ΔH_A, ΔH_L, Thalf_L, ΔH_H, Thalf_H, T_ref)\nmodel = ModelWrapper(Layer(:surface_temp, K, growthmodel))\nobs = []\n\ntempdata=(surface_temp=(270.0:0.1:310.0)K,)\nmanualfit!(model, tempdata; obs=obs)\n\nTo use the interface in a desktop app, use Blink.jl:\n\n\njulia; eval=false using Blink w = Blink.Window() body!(w, interface) ```\n\n\n\n\n\n","category":"method"},{"location":"#GrowthMaps.mapfit!-Tuple{ModelWrapper,Any}","page":"Home","title":"GrowthMaps.mapfit!","text":"mapfit!(wrapper::ModelWrapper, modelkwargs; occurrence=[], precomputed=nothing, kwargs...)\n\nFit a model to the map.\n\nExample\n\nwrapper = ModelWrapper(wiltstress, coldstress, heatstress)\nthrottle = 0.2\ninterface = mapfit!(wrapper, modelkwargs;\n    occurrence=occurrence,\n    precomputed=precomputed,\n    throttle=throttle,\n    markershape=:cross,\n    markercolor=:lightblue,\n    markeropacity=0.4\n)\ndisplay(interface)\n\nTo use the interface in a desktop app, use Blink.jl:\n\nusing Blink\nw = Blink.Window()\nbody!(w, interface)\n\n\n\n\n\n","category":"method"},{"location":"#GrowthMaps.mapgrowth-Tuple{ModelWrapper}","page":"Home","title":"GrowthMaps.mapgrowth","text":"mapgrowth(layers; series::AbstractGeoSeries, tspan::AbstractRange)\n\nCombine growth rates accross layers and subperiods for all required periods.\n\nArguments\n\nlayers: ModelWrapper or Tuple of Layer components, which can also be passed in as individual args.\n\nKeyword Arguments\n\nseries: any AbstractGeoSeries from GeoData.jl\ntspan: AbstractRange for the timespan to run the layers for. This will be the index oof the output Ti dimension.\n\nThe output is a GeoArray with the same dimensions as the passed in stack layers, and a Time dimension with a length of nperiods.\n\n\n\n\n\n","category":"method"},{"location":"#GrowthMaps.rate","page":"Home","title":"GrowthMaps.rate","text":"rate(m, x)\n\nCalculates the rate modifyer for a single cell. Must be defined for all models.\n\nm is the object containing the model parameters, and x is the value at a particular location for of an environmental variable specified by the models key() method, using corresponding to its key field.\n\n\n\n\n\n","category":"function"},{"location":"example/#GrowthMaps.jl-example","page":"Examples","title":"GrowthMaps.jl example","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"Rafael Schouten and James Maino  ","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"In this example we will calculate the expected population growth rates of Spotted Wing Drosophila (SWD) D. suzukii, for each month of the year on a 9km grid accross North America.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"We'll experiment with running the model with a number of different datasets. GrowthMaps.jl, via GeoData.jl faciliates using a wide range of input sources. First we will use aggregated data in tiff files, then aggregate them to in-memory files to run the inferface. Finally if you can download it, we'll use the (huge) SMAP dataset, which is in a custom HDF5 format.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"If you are using this as a .jmd file, it's best in to use atom with the \"uber-juno\" and \"language-weave\" plugins.","category":"page"},{"location":"example/#Load-some-required-packages","page":"Examples","title":"Load some required packages","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"These packages take care of loading and plotting data, and handling sci units and dates.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nusing GrowthMaps, Plots, Unitful, UnitfulRecipes, Dates\nusing GeoData, ArchGDAL, NCDatasets\nusing CSV, DataFrames\nusing Unitful: °C, K, cal, mol\nbasedir = joinpath(dirname(@__FILE__), \"../\")","category":"page"},{"location":"example/#Define-model-components","page":"Examples","title":"Define model components","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"First we'll define the growth model using SchoolfieldIntrinsicGrowth, based on Schoolfield (1981).","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"When defining model components, the first parameter is a :symbol for the required raster layer in the source data.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\np = 3e-01\nΔH_A = 3e4cal/mol\nΔH_L = -1e5cal/mol\nΔH_H = 3e5cal/mol\nThalf_L = 2e2K\nThalf_H = 3e2K\nT_ref = K(25.0°C)\ngrowthmodel = SchoolfieldIntrinsicGrowth(p, ΔH_A, ΔH_L, Thalf_L, ΔH_H, Thalf_H, T_ref)\ngrowth = Layer(:surface_temp, K, growthmodel)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"If these are only estimated parameters, We can fit the model to a a dataset of growth rate and temperature. First extract our independent and dependent variables from the example CSV:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nmkpath(joinpath(basedir, \"build\"))\nobsdata = CSV.File(joinpath(basedir, \"swd_ecophys_data.csv\"), select=[:x_value, :y_value, :y_key]) |> DataFrame\nobsdata = filter(d -> d.y_key == \"r_m\", obsdata) |> dropmissing","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Then extract the required data colummns, and convert temperature values from unitless Celcius to explit Kelvins, using Unitful.jl:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nobsrate = obsdata.y_value\nobstemp = obsdata.x_value * °C .|> K\nobs = collect(zip(obstemp, obsrate))","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Now we can fit the model. The fitrate function provides an easy way to fit the models in GrowthMaps or your own custom RateModels, using the LsqFit.jl package:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nfittedgrowth = fit(growth, obs)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Now plot the fit against the data:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\ntemprange = (270.0:0.1:310.0)K\np = plot(x -> GrowthMaps.rate(fittedgrowth, x), temprange; label=\"fitted\")\nscatter!(p, obs; label=\"observed \")","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"(Image: )","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"We can also try tweaking the fitting the model manually in a user interface. Model components are immutable (for performance reasons), so we wrap the model in a mutable wraper so we can use the results. We parametrise the model over the same temperature range that we are plotting, using the :surface_temp key that the model requires:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nwrapper = ModelWrapper(fittedgrowth)\ntempdata=(surface_temp=temprange,)\nmanualfit!(wrapper, tempdata; obs=obs)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"If you are happy with the result, you we can update extract the manual fit to use to generate our growth rate maps:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nfittedgrowth = wrapper.model","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Note that manualfit! will also work for a tuple of model components that use the same source data, like (growth, heatstress, coldstress).","category":"page"},{"location":"example/#Load-spatial-data","page":"Examples","title":"Load spatial data","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"Later we can use real SMAP datasets using GeoData.jl SMAPseries loader. But downloading the dataset takes too long for an example. Instead we will download and unzip some lower resolution monthly data to use in the model:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\ndataurl = \"https://media.githubusercontent.com/media/cesaraustralia/GrowthMaps.jl/data/SMAP_aggregated27km.zip\"\nzipfilepath = joinpath(basedir, \"SMAP_aggregated27km.zip\")\nunzippedfolder = joinpath(basedir, \"SMAP_aggregated27km\")\nisfile(zipfilepath) || download(dataurl, zipfilepath)\nrun(`unzip -o $zipfilepath -d $basedir`);\n\n# Get the paths for to all the wilting and surface temp files\nfilenames = readdir(unzippedfolder)\nwilting_filenames = filter(fn -> occursin(r\"land_fraction_wilting\", fn), filenames)\nsurface_temp_filenames = filter(fn -> occursin(r\"surface_temp\", fn), filenames)\nwilting_paths = joinpath.(Ref(unzippedfolder), wilting_filenames)\nsurface_temp_paths = map(p -> joinpath(unzippedfolder, p), surface_temp_filenames)\n\n# Get the dates covered in the data from the `surface_temp` files list using regex\ndf = DateFormat(\"yyyymmddTHHMMSS\");\ndates = DateTime.(replace.(surface_temp_paths, Ref(r\".*_(\\d+T\\d+).tif\" => s\"\\1\")), Ref(df))","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"We know the land_fraction_wilting files are for the same dates.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Now we have the files and date seies, we can put together a series of GeoData.jl stacks to load lazily from disk while running mapgrowth.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"The beauty of this approach is that we can use a lot of different source file types and folder configurations without converting them or running out of RAM.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nfunction makestack(i)\n    GDALstack((land_fraction_wilting=wilting_paths[i],\n               surface_temp=surface_temp_paths[i]);\n        window=(Band(1),), # lazy view applied when the file is loaded.\n        childkwargs=(usercrs=EPSG(4326),), # lets us use lat/lon without knowing the underlying projection\n    )\nend\nstacks = [makestack(i) for i in 1:length(surface_temp_paths)]\ntimedim = Ti(dates; mode=Sampled(span=Regular(Hour(3))))\ntiffseries = GeoSeries(stacks, (timedim,))","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"We can plot a layer from a file at some date in the series:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\ntiffseries[Ti(Near(DateTime(2016, 2)))][:surface_temp] |> plot","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Set the time period to a month, and set the length of the subsample period to the available times over one day:","category":"page"},{"location":"example/#Run-a-model-over-the-spatial-data","page":"Examples","title":"Run a model over the spatial data","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"Define a timespan range to run the model over:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\ntspan=DateTime(2016, 1):Month(1):DateTime(2016, 12)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Dates.DateTime(\"2016-01-01T00:00:00\"):Dates.Month(1):Dates.DateTime(\"2016-1\n2-01T00:00:00\")","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Then to start, we'll run a simple model that only calculates growth rate.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\noutput = mapgrowth(fittedgrowth;\n  series=tiffseries,\n  tspan=tspan,\n)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Then plot the results:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\noutput[Ti(1)] |> plot","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"It doesn't really capture realistic population growth: there are no growth rates below zero. We need to add some stress models. Stress models model processes that produce negative deathrates in the population, as oposed to rate models, where the minimum growth rate is zero.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Stress models have a threshold in K and mortality rate per degree K. LowerStress models stress below the given threshold, while UpperStress models stress induced above a threshold.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"We will define stress models for cold, heat and wilt stress. As SWD live on and around plants, we use the proportion of plants wilting as an indicater of stress induced by lack of moisture.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\ncoldthresh = 7.0°C |> K  # Enriquez2017\ncoldmort = -log(1.00) * K^-1\ncoldstress = Layer(:surface_temp, K, ColdStress(coldthresh, coldmort))\n\nheatthresh = 30.0°C |> K # Kimura2004\nheatmort = -log(1.15) * K^-1\nheatstress = Layer(:surface_temp, K, HeatStress(heatthresh, heatmort))\n\nwiltthresh = 0.5 # default?\nwiltmort = -log(1.1);\nwiltstress = Layer(:land_fraction_wilting, WiltStress(wiltthresh, wiltmort));","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"To build a more complex model, we can chain components together in a tuple, and again, run and plot them:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\noutput = mapgrowth(fittedgrowth, heatstress;\n    series=tiffseries,\n    tspan=tspan,\n)\noutput[Ti(1)] |> plot","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"That looks better. There are negative growth rates in hot regions. Now lets run a full model with growth and three stressors:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\noutput = mapgrowth(fittedgrowth, coldstress, heatstress, wiltstress;\n    series=tiffseries,\n    tspan=tspan,\n)\noutput[Ti(1)] |> plot","category":"page"},{"location":"example/#Compare-with-observation-data","page":"Examples","title":"Compare with observation data","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"To compare out simulation with observations data, we'll first load them from a CSV file:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\ncsvurl = \"https://raw.githubusercontent.com/cesaraustralia/GrowthMaps.jl/data/Oersted_occurrence.csv\"\ncsvfilename = joinpath(basedir, \"Oersted_occurrence.csv\")\nisfile(csvfilename) || download(csvurl, csvfilename)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Then scatter them on a map:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nobs = CSV.File(csvfilename)\noccurrence = collect(zip(obs.Longitude, obs.Latitude))\np = plot(output[Ti(1)])\nscatter!(p, occurrence; markersize=2.0, markercolor=:white, markershape=:circle, label=\"obs\")","category":"page"},{"location":"example/#Parametrising-models-using-interactive-maps","page":"Examples","title":"Parametrising models using interactive maps","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"If you need to adjust the model based on the distribution, this can be done live in the interface, as with the manual fit.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"But parametrising maps on large datasets is processor intensive, which inhibits interactive fedback. To reduce processing, we can aggregate the spatial data to a more manageable size.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"You can experiment with the agg size to compromise between quality and render time. Large values will look pixelated but will run fast.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Center() simply takes the central cell. Statistics.mean would take the mean value.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nagg = 8\naggseries = GeoData.aggregate(Center(), tiffseries, (Lon(agg), Lat(agg)))","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"As the combination of models is additive, we can pre-build parts of the model we don't want to fit manually, which simplifies the interfaces and helps performance. Seeing we allready fit the growth response to empiracle data, lets just fit the stress responses to the map:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nmodelkwargs = (series=aggseries, tspan=tspan)\nprecomputed = mapgrowth(fittedgrowth; modelkwargs...)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Then fit the other components. throttle will dictate how fast the interface  updates. Make it larger on a slow machine, smaller on a faster one. The window argument lets us select a window of the output to view, using DimensionalData.jl/GeoData.jl Dimensions and Selectors. Here we only plot the first time: but you can select any/multiple, and select them with Near(DateTime(2016,2)) or similar.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nwrapper = ModelWrapper(wiltstress, coldstress, heatstress)\nthrottle = 0.2\ninterface = mapfit!(wrapper, modelkwargs;\n    occurrence=occurrence,\n    precomputed=precomputed,\n    throttle=throttle,\n    markershape=:cross,\n    markercolor=:lightblue,\n    markeropacity=0.4,\n    window=(Ti(1),),\n)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"In atom, this will show the interface in the plot pane:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\ndisplay(interface)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"To use the it in a desktop app, use Blink.jl:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nusing Blink\nw = Blink.Window()\nbody!(w, interface)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"And get the updated model components from the wrapper:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nwiltstress, coldstress, heatstress = wrapper.model","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Now we will put together decent population growth maps using the higher resolutions data, and a monthly tiestep:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\noutput = mapgrowth(fittedgrowth, wiltstress, coldstress, heatstress;\n    series=tiffseries,\n    tspan=tspan,\n);\nplot(output[Ti(1:3:12)]; axis=false)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"This output is ready to use for projecting growthrates, or in a dispersal simulation using Dispersal.jl. Lets save it as a NetCDF file using GeoData.jl:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nspan(output, Ti)\nsavepath = joinpath(basedir, \"growthrates.ncd\")\nwrite(savepath, NCDarray, output)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"We can load it again with:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nncarray = NCDarray(savepath)\nplot(ncarray[Ti(1)])","category":"page"},{"location":"example/#Use-the-SMAP-dataset","page":"Examples","title":"Use the SMAP dataset","text":"","category":"section"},{"location":"example/","page":"Examples","title":"Examples","text":"Using aggregated data loses some of the impact of the stress models, which respond to extremes, not averages. If you need to use the model for a serious application, run it on the real SMAP dataset.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Unfortunately we can't just download the data for you with a script, as you need to log in to an account to have access.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"But GeoData.jl has a SMAPseries() constructor that will automate the whole process of loading SMAP HDF5 files from a folder once you have the data.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"We can also reduce the numer of days processed to 8 each month (or whatever) using the Where selector from DimensionalData.jl.","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nusing HDF5\n# Set this to your own SMAP data folder\nsmappath = \"/home/raf/Storage/Data/SMAP/SMAP_L4_SM_gph_v4\"\n# Choose the dayes of month to use\ndays = (1, 4, 8, 12, 16, 20, 23, 27) # 8 days per month\n#days = 1:31 # all days\n# Use the `Where` selector to choose dates in the time index by day of month\nsmapseries = SMAPseries(smappath)[Ti(Where(d -> dayofmonth(d) in days))]","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"Run the model:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\n@time output = mapgrowth(fittedgrowth, wiltstress, coldstress, heatstress;\n    series=smapseries, tspan=tspan,\n)\nplot(output[Ti(1:3:12)]; axis=false)","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"And save a netcdf:","category":"page"},{"location":"example/","page":"Examples","title":"Examples","text":"\nwrite(joinpath(basedir, \"growthrates.ncd\"), NCDarray, output)","category":"page"}]
}
