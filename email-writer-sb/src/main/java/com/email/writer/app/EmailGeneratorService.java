package com.email.writer.app;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {
	
	private final WebClient webClient;
	private final String apiKey;
	
	public EmailGeneratorService(WebClient.Builder webClientBuilder,
								@Value("${gemini.api.url}") String baseUrl,
								@Value("${gemini.api.key}") String geminiApiKey) {
		
		this.apiKey = geminiApiKey;
		this.webClient = webClientBuilder.baseUrl(baseUrl).build();
	}
	
	
	
	public String generateEmailReply(EmailRequest emailRequest) {
		// Built the prompt
		String prompt = buildPrompt(emailRequest);
		
		// Prepare raw JSON Body
		String requestBody = String.format("""
				{
					"contents": [
					  {
					  	"parts": [
					  		{
					  			"text": "%s"
					  		}
					  	]
					  }
					]		
				}""", prompt);
		
		// Send Request
		String response = webClient.post()
						  .uri(UriBuilder -> UriBuilder
								  	.path("/v1beta/models/gemini-2.0-flash:generateContent")
								  	.build())
						  .header("Content-Type", "application/json")
						  .header("X-goog-api-key", apiKey)
						  .bodyValue(requestBody)
						  .retrieve()
						  .bodyToMono(String.class)
						  .block();
		
		// Extract response
		return extractResponseContent(response);
		
	}

	
	private String extractResponseContent(String response) {
		
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(response);
			
			return root.path("candidates")
				.get(0)
				.path("content")
				.path("parts")
				.get(0)
				.path("text")
				.asText();
			
		} catch (JsonProcessingException e) {
			throw new RuntimeException();
		}
		
	}



	private String buildPrompt(EmailRequest emailRequest) {
		StringBuilder prompt = new StringBuilder();
		prompt.append("Generate a professional email reply for the following email:");
			
		
		if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
			prompt.append("Use a ").append(emailRequest.getTone()).append(" tone. ");
			// Use a casual tone.
		}
		
		prompt.append("\nOrginal email: \n").append(emailRequest.getEmailContent());
		
		return prompt.toString();
	}
}
