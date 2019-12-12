
struct CustomBulma <: InteractBase.WidgetTheme; end

const custom_css = "/home/raf/julia/GrowthMaps/assets/interact.css"

InteractBase.libraries(::CustomBulma) = [InteractBase.libraries(Interact.Bulma())...]
InteractBase.registertheme!(:custombulma, CustomBulma())
settheme!(CustomBulma())

"""
    fit(model, xs::AbstractArray, ys::AbstractArray)

Fit a model to data with least squares regression, using `curve_fit` from
LsqFit.jl. The passed in model should be initialised with sensible defaults,
these will be used as the initial parameters for the optimization.

Any (nested) `Real` fields on the struct are flattened to a parameter vector using
[Flatten.jl](http://github.com/rafaqz/Flatten.jl). Fields can be marked to ignore
using the `@flattenable` macro from [FieldMetadata.jl](http://github.com/rafaqz/FieldMetadata.jl).

## Arguments
- `model`: Any constructed [`RateModel`](@ref), including custom models.
- `xs`: AbstactArray of independent variables (model input values)
- `ys`: AbstactArray of dependent variables (model output values)

## Returns
The model with fitted parameters
"""
fit(model::ModelWrapper, xs::AbstractArray, ys::AbstractArray) = begin
    wrapper.model = fit(wrapper.model, xs, ys)
    wrapper
end
fit(model, xs::AbstractArray, ys::AbstractArray) = begin
    fit = curve_fit(ModelWrapper(model), xs, ys, [flatten(model, Real)...])
    reconstruct(model, fit.param)
end

"""
Returns the wrapper holding the fitted model
"""
manualfit!(wrapper::ModelWrapper, xs, ys, data; kwargs...) =
    interface!(wrapper, plotfit, (xs, ys, data); kwargs...)

plotfit(model, (xs, ys, data)) = begin
    predictions = combinemodels(model, data)
    p = plot(first(data), predictions; label="predicted", legend=false)
    scatter!(p, xs, ys; label="observed")
    p
end

"""
Fit a model to the map
"""
mapfit!(wrapper::ModelWrapper, series, mapgrowth_kwargs; occurrance=[],
        precomputed=nothing, plot_kwargs=(), kwargs...) =
    interface!(wrapper, plotmap, (series, mapgrowth_kwargs, occurrance, precomputed); kwargs...)

plotmap(model, (series, mapgrowth_kwargs, occurance, precomputed);
        window=(Band(1),), markercolor=:white, markersize=2.0,
        size=(1000,400), clims=(-2.0, 0.25), legend=:none, kwargs...) = begin
    output = mapgrowth(model, series; mapgrowth_kwargs...)
    output = isnothing(precomputed) ? output : output .+ precomputed
    p = plot(output[window...]; size=size, clims=clims, legend=legend, kwargs...)
    s = scatter!(occurance; markercolor=markercolor, markersize=markersize)
end

interface!(wrapper::ModelWrapper, f, data; use=Number, ignore=Nothing, throttlelen=0.1, kwargs...) = begin
    plotobs = Observable(f(wrapper.model, data; kwargs...))
    sliders, slider_obs, slider_groups = build_sliders(wrapper.model, use, ignore, throttlelen)
    on(slider_obs) do params
        wrapper.model = Flatten.reconstruct(wrapper.model, params, use, ignore)
        plotobs[] = f(wrapper.model, data; kwargs...)
    end
    vbox(plotobs, vbox(slider_groups...))
end


build_sliders(model, use, ignore, throttlelen) = begin
    params = Flatten.flatten(model, use, ignore)
    fnames = fieldnameflatten(model, use, ignore)
    bounds = metaflatten(model, FieldMetadata.bounds, use, ignore)
    ranges = buildrange.(bounds, params)
    parents = parentnameflatten(model, use, ignore)
    descriptions = metaflatten(model, FieldMetadata.description, use, ignore)
    attributes = ((p, n, d) -> Dict(:title => "$p.$n: $d")).(parents, fnames, descriptions)

    sliders = make_slider.(params, fnames, ranges, attributes)
    slider_obs = map((s...) -> s, throttle.(throttlelen, observe.(sliders))...)

    group_title = nothing
    slider_groups = []
    group_items = []
    for i in 1:length(params)
        parent = parents[i]
        if group_title != parent
            group_title == nothing || push!(slider_groups, dom"div"(group_items...))
            group_items = Any[dom"h2"(string(parent))]
            group_title = parent
        end
        push!(group_items, sliders[i])
    end
    push!(slider_groups, dom"h2"(group_items...))

    sliders, slider_obs, slider_groups
end

make_slider(val, lab, rng, attr) = slider(rng; label=string(lab), value=val, attributes=attr)

buildrange(bounds::Tuple, val::T) where T =
    T(bounds[1]):(T(bounds[2])-T(bounds[1]))/1000:T(bounds[2])

electronfit(app; zoom=1.0) = begin
    ui = app(nothing)
    w = Window(Dict("webPreferences"=>Dict("zoomFactor"=>zoom)));
    body!(w, ui);
end
