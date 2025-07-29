import { useEffect, useState } from "react";
import axios from "axios";

export default function UpdateServicesTab({ serviceCenterId }) {
  const [subcategories, setSubcategories] = useState([]);
  const [existingServices, setExistingServices] = useState([]);
  const [formData, setFormData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch service center's existing services
  useEffect(() => {
    const fetchExistingServices = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/api/service-centers/${serviceCenterId}`);
        setExistingServices(res.data.center.services || []);
        console.log("Existing services:", res.data.services);
      } catch (err) {
        console.error("Error fetching existing services:", err);
      }
    };

    fetchExistingServices();
  }, [serviceCenterId]);

  // Fetch all subcategories with categories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/service-centers/services/all-subcategories");
        setSubcategories(res.data.subcategories || []);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };

    fetchSubcategories();
  }, []);

  // Handle input field updates
  const handleInputChange = (index, field, value, subcat) => {
    const updated = [...formData];
    updated[index] = {
      ...updated[index],
      [field]: value,
      categoryId: subcat.category._id,
      categoryName: subcat.category.name,
      subcategoryId: subcat._id,
      subcategoryName: subcat.name,
    };
    setFormData(updated);
  };

  // Filter subcategories: exclude those already in the service center's services
   const filteredSubcategories = subcategories.filter((subcat) =>
    !existingServices.some((service) => {
      const existingId = service.subcategoryId?._id || service.subcategoryId;
      return String(existingId) === String(subcat._id);
    })
  );
// console.log("Available subcategories:", subcategories.map(s => s._id));

  // Submit the new services
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const filtered = formData.filter((entry) => entry?.price && entry?.duration);
      if (filtered.length === 0) {
        setMessage("❌ Please fill at least one service before submitting.");
        setLoading(false);
        return;
      }

      await axios.patch(`http://localhost:5002/api/service-centers/${serviceCenterId}/update-services`, {
        services: filtered,
      });

      setMessage("✅ Services updated successfully");
    } catch (err) {
      console.error("Failed to update:", err);
      setMessage("❌ Failed to update services");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Update Services Offered</h3>

      <div className="services-list">
        {filteredSubcategories.length > 0 ? (
          filteredSubcategories.map((service, index) => (
            <div
              key={service._id}
              style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
            >
              <h4>
                {service.subcategoryName} (from {service.category.name})
              </h4>
              <label>Price: </label>
              <input
                type="number"
                value={formData[index]?.price || ""}
                onChange={(e) => handleInputChange(index, "price", e.target.value, service)}
              />
              <br />
              <label>Duration (minutes): </label>
              <input
                type="number"
                value={formData[index]?.duration || ""}
                onChange={(e) => handleInputChange(index, "duration", e.target.value, service)}
              />
            </div>
          ))
        ) : (
          <p>✅ All services are already added.</p>
        )}
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Updating..." : "Update Services"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
