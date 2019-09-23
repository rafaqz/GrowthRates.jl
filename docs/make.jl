using Documenter, GrowthMaps, Weave, IJulia

example = "src/example.jmd"
# Remove YAML
mdlines = readlines(example)
md = join(mdlines[findall(x -> x=="---", mdlines)[2]+1:end], "\n")
# Format code blocks for jldoctest 
md = replace(md, Regex("```julia.*") => "```jldoctest")
write("src/example.md", md)

# Generate HTML docs
makedocs(
    modules = [GrowthMaps],
    sitename = "GrowthMaps.jl",
    pages = [
        "Home" => "index.md",
        "Examples" => "example.md"
    ]
)

deploydocs(
    repo = "github.com/rafaqz/GrowthMaps.jl.git",
)

pdfdir = "build/pdf" 
notebookdir = "build/notebook"
mkpath.((pdfdir, notebookdir))

# Generate examples pdf
weave(example, out_path=pdfdir, doctype="pandoc2pdf")

# Generate examples notebook
convert_doc(example, joinpath(notebookdir, "example.ipynb"))