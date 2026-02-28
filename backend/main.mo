import Set "mo:core/Set";
import List "mo:core/List";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  type PoseCriteria = {
    bodyType : Text;
    age : Nat;
    ethnicity : Text;
    artStyle : Text;
    height : Float;
    weight : Float;
    negativePrompt : Text;
    aspectRatio : Text;
    cameraLens : Text;
    clothing : Text;
    situationPose : Text;
    situationFiguration : Text;
    situationBehavior : Text;
    situationPosing : Text;
    cameraAngle : Text;
    lighting : Text;
    environment : Text;
    composition : Text;
  };

  type Preset = {
    name : Text;
    criteria : PoseCriteria;
  };

  type PromptHistory = {
    prompt : Text;
    timestamp : Time.Time;
    criteria : PoseCriteria;
  };

  type GenerateImageArgs = {
    negativePrompt : Text;
    positivePrompt : Text;
    aspectRatio : Text;
    seed : Int;
    temperature : Float;
    model : Text;
  };

  let poseCriteriaSet = Set.empty<Text>();
  let presetsList = List.empty<Preset>();
  let promptHistoryList = List.empty<PromptHistory>();

  include MixinStorage();

  public shared ({ caller }) func sendQueries(_ : PoseCriteria, combinations : Text) : async Text {
    poseCriteriaSet.add(combinations);
    let historyEntry : PromptHistory = {
      prompt = combinations;
      timestamp = Time.now();
      criteria = {
        bodyType = "";
        age = 0;
        ethnicity = "";
        artStyle = "";
        height = 0.0;
        weight = 0.0;
        negativePrompt = "";
        aspectRatio = "";
        cameraLens = "";
        clothing = "";
        situationPose = "";
        situationFiguration = "";
        situationBehavior = "";
        situationPosing = "";
        cameraAngle = "";
        lighting = "";
        environment = "";
        composition = "";
      };
    };
    promptHistoryList.add(historyEntry);
    combinations;
  };

  public shared ({ caller }) func savePreset(name : Text, criteria : PoseCriteria) : async Bool {
    presetsList.add({
      name;
      criteria;
    });
    true;
  };

  public query ({ caller }) func getPresets() : async [Preset] {
    presetsList.toArray();
  };

  public query ({ caller }) func getPromptHistory() : async [PromptHistory] {
    promptHistoryList.toArray();
  };

  public query ({ caller }) func getSituationBehaviors() : async [Text] {
    [
      "gazing wistfully into distance, gentle smile, serene contemplation",
      "laughing joyfully while twirling, carefree and energetic",
      "leaning in for a kiss, intense eye contact, romantic tension",
    ];
  };
};
