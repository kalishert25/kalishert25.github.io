import { Operations, find_all_equations } from "./algorithm.js"
const year_box = document.getElementById("year")
const form = document.getElementById("form")
const download_link = document.getElementById("download-button")
const checkbox_container_unary = document.getElementById(
    "checkbox-container-unary",
)
const checkbox_container_binary = document.getElementById(
    "checkbox-container-binary",
)
form.addEventListener("submit", handleSubmit)
download_link.style.display = "none"
const DEFAULT_OPERATIONS = Operations()
for (const key in DEFAULT_OPERATIONS) {
    const operation = DEFAULT_OPERATIONS[key]
    console.log(operation)
    const to = createToggle(key, operation.web_symbol("a", "b"))
    if (operation.arity === 1) {
        checkbox_container_unary.innerHTML += to
    } else if (operation.arity === 2) {
        checkbox_container_binary.innerHTML += to
    }
}
year_box.defaultValue = new Date().getFullYear()

const all_checkboxes = document.querySelectorAll(".pill-checkbox")

all_checkboxes.forEach((checkBox) => {
    checkBox.addEventListener("click", (ev) => {
        toggleButton(checkBox)
    })
})
window.onload = () => {}

function createToggle(id, text) {
    return `
    <label
    for="toggle-${id}"
    class="relative m-1 inline-flex cursor-pointer items-center pl-2"
>
    <input
        type="checkbox"
        value="true"
        id="toggle-${id}" name="${id}"
        class="peer sr-only"
        checked
    /> 
    <div
        class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[9px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-teal-800"
    ></div>
    <span class="ml-3 text-sm font-medium text-gray-300">$$ ${text} $$</span>
</label>`
}
let w, textContent

function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formProps = Object.fromEntries(formData)
    console.log(formProps)
    startWorker(formProps)

    function startWorker(myData) {
        if (typeof Worker !== "undefined") {
            if (typeof w == "undefined") {
                w = new Worker("algorithm.js", { type: "module" })
                w.postMessage(myData)
            }
            w.onmessage = function (event) {
                textContent = event.data
                console.log("done")
                w.terminate()
                w = undefined
                download_link.style.display = "block"
            }
        } else {
            document.getElementById("result").innerHTML =
                "Sorry! No Web Worker support."
        }
    }
}
download_link.onclick = downloadTextFile

function downloadTextFile() {
    if (textContent == undefined) {
        return
    }
    var blob = new Blob([textContent], { type: "text/plain" })

    // Create a temporary URL pointing to the Blob
    var url = URL.createObjectURL(blob)

    // Create a temporary anchor element
    var link = document.createElement("a")

    // Set the href attribute of the anchor element to the temporary URL
    link.href = url

    // Set the download attribute to specify the file name
    link.download = "file.txt"

    // Programmatically click the link to trigger the download
    link.click()

    // Clean up the temporary URL and anchor element
    URL.revokeObjectURL(url)
    link.remove()
}
