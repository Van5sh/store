"use server"

interface CityAPI {
  cityId: string
  cityName: string
  state: string
}

interface City {
  id: string
  name: string
  state: string
}

async function getCities(): Promise<City[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/city`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch cities: ${res.status}`)
    }

    const json = await res.json()
    const data = json.data

    if (!Array.isArray(data)) {
      throw new Error("Cities response is not an array")
    }

    return data.map((city: CityAPI) => ({
      id: city.cityId,
      name: city.cityName,
      state: city.state,
    }))

  } catch (err) {
    console.error("Get Cities Error:", err)
    throw new Error("Failed to fetch cities")
  }
}

export default getCities